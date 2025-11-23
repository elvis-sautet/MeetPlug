import EventEmitter from 'eventemitter3';
import { SignalingClient } from './SignalingClient';
import { WebRTCManager } from './WebRTCManager';
import type {
  MeetPlugConfig,
  Room,
  Participant,
  ChatMessage,
  MediaConstraints,
  MeetPlugEvents,
  SignalingMessage,
  MediaStatePayload,
  ReactionType,
} from '../types';

export class MeetPlugSDK extends EventEmitter<MeetPlugEvents> {
  private config: MeetPlugConfig;
  private signalingClient: SignalingClient;
  private webrtcManager: WebRTCManager;
  private currentRoom: Room | null = null;
  private localParticipant: Participant | null = null;
  private participants: Map<string, Participant> = new Map();
  private remoteStreams: Map<string, MediaStream> = new Map();
  private chatMessages: ChatMessage[] = [];
  private localStream: MediaStream | null = null;

  constructor(config: MeetPlugConfig = {}) {
    super();
    this.config = {
      signalingServer: config.signalingServer || 'ws://localhost:3001',
      iceServers: config.iceServers,
      autoConnect: config.autoConnect ?? true,
      enableChat: config.enableChat ?? true,
      enableScreenShare: config.enableScreenShare ?? true,
      maxParticipants: config.maxParticipants || 50,
    };

    this.signalingClient = new SignalingClient(this.config.signalingServer);
    this.webrtcManager = new WebRTCManager(this.config);

    this.setupSignalingListeners();
    this.setupWebRTCListeners();

    if (this.config.autoConnect) {
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    try {
      await this.signalingClient.connect();
    } catch (error) {
      console.warn('Signaling server not available, using direct mode');
    }
  }

  private setupSignalingListeners(): void {
    this.signalingClient.on('offer', async (message: SignalingMessage) => {
      try {
        const answer = await this.webrtcManager.createAnswer(message.from, message.data);
        this.signalingClient.sendAnswer(
          message.roomId,
          this.localParticipant!.id,
          message.from,
          answer
        );
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    this.signalingClient.on('answer', async (message: SignalingMessage) => {
      try {
        await this.webrtcManager.handleAnswer(message.from, message.data);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    this.signalingClient.on('ice-candidate', async (message: SignalingMessage) => {
      try {
        await this.webrtcManager.addIceCandidate(message.from, message.data);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    this.signalingClient.on('participant:joined', (message: SignalingMessage) => {
      if (message.from !== this.localParticipant?.id) {
        this.handleParticipantJoined(message.from, message.data);
      }
    });

    this.signalingClient.on('participant:left', (message: SignalingMessage) => {
      this.handleParticipantLeft(message.from);
    });

    this.signalingClient.on('chat:message', (message: SignalingMessage) => {
      this.handleChatMessage(message);
    });

    this.signalingClient.on('media-state', (message: SignalingMessage) => {
      this.handleMediaStateChange(message.from, message.data);
    });
  }

  private setupWebRTCListeners(): void {
    this.webrtcManager.on('ice-candidate', (peerId: string, candidate: RTCIceCandidate) => {
      if (this.currentRoom) {
        this.signalingClient.sendIceCandidate(
          this.currentRoom.id,
          this.localParticipant!.id,
          peerId,
          candidate
        );
      }
    });

    this.webrtcManager.on('remote-stream', (peerId: string, stream: MediaStream) => {
      this.remoteStreams.set(peerId, stream);

      const participant = this.participants.get(peerId);
      if (participant) {
        participant.stream = stream;
        this.emit('stream:added', peerId, stream);
        this.emit('participant:updated', participant);
      }
    });

    this.webrtcManager.on('peer-disconnected', (peerId: string) => {
      this.handleParticipantLeft(peerId);
    });
  }

  async joinRoom(roomId: string, participantName?: string): Promise<Room> {
    try {
      // Initialize media first
      await this.initializeMedia();

      // Create local participant
      const participantId = this.generateId();
      this.localParticipant = {
        id: participantId,
        name: participantName || 'Guest',
        isLocal: true,
        stream: this.localStream!,
        audioEnabled: true,
        videoEnabled: true,
        screenShareEnabled: false,
        joinedAt: new Date(),
        handRaised: false,
        isMutedByHost: false,
        reaction: null,
      };

      // Create room
      this.currentRoom = {
        id: roomId,
        name: roomId,
        participants: [this.localParticipant],
        createdAt: new Date(),
        hostId: participantId,
      };

      // Join via signaling
      this.signalingClient.joinRoom({
        roomId,
        participantId,
        participantName,
      });

      this.emit('room:joined', this.currentRoom);
      return this.currentRoom;
    } catch (error) {
      this.emit('room:error', error as Error);
      throw error;
    }
  }

  leaveRoom(): void {
    if (!this.currentRoom || !this.localParticipant) return;

    this.signalingClient.leaveRoom(this.currentRoom.id, this.localParticipant.id);
    this.cleanup();
    this.emit('room:left');
  }

  async initializeMedia(constraints?: MediaConstraints): Promise<MediaStream> {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        audio: constraints?.audio ?? true,
        video: constraints?.video ?? { width: 1280, height: 720 },
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
      this.webrtcManager.setLocalStream(this.localStream);

      return this.localStream;
    } catch (error) {
      throw new Error(`Failed to initialize media: ${(error as Error).message}`);
    }
  }

  async toggleAudio(): Promise<void> {
    if (!this.localStream || !this.localParticipant) return;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.localParticipant.audioEnabled = audioTrack.enabled;
      this.broadcastMediaState();
    }
  }

  async toggleVideo(): Promise<void> {
    if (!this.localStream || !this.localParticipant) return;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.localParticipant.videoEnabled = videoTrack.enabled;
      this.broadcastMediaState();
    }
  }

  async toggleScreenShare(): Promise<void> {
    if (!this.localParticipant) return;

    if (this.localParticipant.screenShareEnabled) {
      await this.stopScreenShare();
    } else {
      await this.startScreenShare();
    }
  }

  private async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      const videoTrack = this.localStream?.getVideoTracks()[0];

      if (videoTrack && screenTrack) {
        this.webrtcManager.replaceTrack(videoTrack, screenTrack);

        screenTrack.onended = () => {
          this.stopScreenShare();
        };

        this.localParticipant!.screenShareEnabled = true;
        this.broadcastMediaState();
        this.emit('screen:sharing:started', this.localParticipant!.id);
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  private async stopScreenShare(): Promise<void> {
    if (!this.localStream) return;

    const constraints: MediaStreamConstraints = {
      video: { width: 1280, height: 720 },
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newVideoTrack = newStream.getVideoTracks()[0];
      const oldVideoTrack = this.localStream.getVideoTracks()[0];

      if (oldVideoTrack) {
        oldVideoTrack.stop();
      }

      if (newVideoTrack) {
        this.webrtcManager.replaceTrack(oldVideoTrack, newVideoTrack);
        this.localStream.removeTrack(oldVideoTrack);
        this.localStream.addTrack(newVideoTrack);
      }

      this.localParticipant!.screenShareEnabled = false;
      this.broadcastMediaState();
      this.emit('screen:sharing:stopped', this.localParticipant!.id);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  sendChatMessage(content: string): void {
    if (!this.currentRoom || !this.localParticipant) return;

    const message: ChatMessage = {
      id: this.generateId(),
      senderId: this.localParticipant.id,
      senderName: this.localParticipant.name,
      content,
      timestamp: new Date(),
      type: 'text',
    };

    this.chatMessages.push(message);
    this.signalingClient.sendChatMessage(this.currentRoom.id, this.localParticipant.id, content);
    this.emit('chat:message', message);
  }

  private handleParticipantJoined(participantId: string, data: any): void {
    const participant: Participant = {
      id: participantId,
      name: data.participantName || 'Guest',
      isLocal: false,
      audioEnabled: true,
      videoEnabled: true,
      screenShareEnabled: false,
      joinedAt: new Date(),
      handRaised: false,
      isMutedByHost: false,
      reaction: null,
    };

    this.participants.set(participantId, participant);

    if (this.currentRoom) {
      this.currentRoom.participants.push(participant);
    }

    // Create peer connection and send offer
    this.createOfferForPeer(participantId);

    this.emit('participant:joined', participant);
  }

  private async createOfferForPeer(peerId: string): Promise<void> {
    try {
      const offer = await this.webrtcManager.createOffer(peerId);
      if (this.currentRoom && this.localParticipant) {
        this.signalingClient.sendOffer(this.currentRoom.id, this.localParticipant.id, peerId, offer);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  private handleParticipantLeft(participantId: string): void {
    this.participants.delete(participantId);
    this.remoteStreams.delete(participantId);
    this.webrtcManager.closePeerConnection(participantId);

    if (this.currentRoom) {
      this.currentRoom.participants = this.currentRoom.participants.filter(
        (p) => p.id !== participantId
      );
    }

    this.emit('participant:left', participantId);
  }

  private handleChatMessage(message: SignalingMessage): void {
    const chatMessage: ChatMessage = {
      id: this.generateId(),
      senderId: message.from,
      senderName: this.participants.get(message.from)?.name || 'Unknown',
      content: message.data.content,
      timestamp: new Date(message.timestamp),
      type: 'text',
    };

    this.chatMessages.push(chatMessage);
    this.emit('chat:message', chatMessage);
  }

  private handleMediaStateChange(participantId: string, state: MediaStatePayload): void {
    const participant = this.participants.get(participantId);
    if (participant) {
      participant.audioEnabled = state.audioEnabled;
      participant.videoEnabled = state.videoEnabled;
      participant.screenShareEnabled = state.screenShareEnabled;
      this.emit('participant:updated', participant);

      if (state.screenShareEnabled) {
        this.emit('screen:sharing:started', participantId);
      } else if (participant.screenShareEnabled && !state.screenShareEnabled) {
        this.emit('screen:sharing:stopped', participantId);
      }
    }
  }

  private broadcastMediaState(): void {
    if (!this.currentRoom || !this.localParticipant) return;

    const state: MediaStatePayload = {
      participantId: this.localParticipant.id,
      audioEnabled: this.localParticipant.audioEnabled,
      videoEnabled: this.localParticipant.videoEnabled,
      screenShareEnabled: this.localParticipant.screenShareEnabled,
    };

    this.signalingClient.sendMediaState(this.currentRoom.id, this.localParticipant.id, state);
  }

  // New Features

  toggleRaiseHand(): void {
    if (!this.localParticipant) return;

    this.localParticipant.handRaised = !this.localParticipant.handRaised;
    this.emit('participant:updated', this.localParticipant);

    // Broadcast to other participants
    // TODO: Add signaling for raise hand
  }

  sendReaction(reaction: ReactionType): void {
    if (!this.localParticipant) return;

    this.localParticipant.reaction = reaction;
    this.emit('participant:updated', this.localParticipant);

    // Clear reaction after 3 seconds
    setTimeout(() => {
      if (this.localParticipant) {
        this.localParticipant.reaction = null;
        this.emit('participant:updated', this.localParticipant);
      }
    }, 3000);

    // TODO: Broadcast to other participants
  }

  muteParticipant(participantId: string): void {
    if (!this.localParticipant || !this.currentRoom) return;

    // Only host can mute others
    if (this.currentRoom.hostId !== this.localParticipant.id) {
      console.warn('Only host can mute participants');
      return;
    }

    const participant = this.participants.get(participantId);
    if (participant) {
      participant.isMutedByHost = true;
      participant.audioEnabled = false;
      this.emit('participant:updated', participant);
      // TODO: Broadcast mute command to participant
    }
  }

  unmuteParticipant(participantId: string): void {
    if (!this.localParticipant || !this.currentRoom) return;

    // Only host can unmute others
    if (this.currentRoom.hostId !== this.localParticipant.id) {
      console.warn('Only host can unmute participants');
      return;
    }

    const participant = this.participants.get(participantId);
    if (participant) {
      participant.isMutedByHost = false;
      this.emit('participant:updated', participant);
      // TODO: Broadcast unmute permission to participant
    }
  }

  private cleanup(): void {
    this.webrtcManager.destroy();
    this.signalingClient.disconnect();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    this.currentRoom = null;
    this.localParticipant = null;
    this.participants.clear();
    this.remoteStreams.clear();
    this.chatMessages = [];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Getters
  getRoom(): Room | null {
    return this.currentRoom;
  }

  getLocalParticipant(): Participant | null {
    return this.localParticipant;
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  getAllParticipants(): Participant[] {
    const all = this.localParticipant ? [this.localParticipant] : [];
    return [...all, ...this.getParticipants()];
  }

  getChatMessages(): ChatMessage[] {
    return this.chatMessages;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  destroy(): void {
    this.cleanup();
    this.removeAllListeners();
  }
}
