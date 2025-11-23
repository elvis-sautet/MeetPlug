import EventEmitter from 'eventemitter3';
import type { MeetPlugConfig } from '../types';

export class WebRTCManager extends EventEmitter {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private config: RTCConfiguration;
  private localStream: MediaStream | null = null;

  constructor(config?: MeetPlugConfig) {
    super();
    this.config = {
      iceServers: config?.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };
  }

  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    if (this.peerConnections.has(peerId)) {
      return this.peerConnections.get(peerId)!;
    }

    const pc = new RTCPeerConnection(this.config);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('ice-candidate', peerId, event.candidate);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      this.emit('remote-stream', peerId, event.streams[0]);
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      this.emit('connection-state', peerId, pc.connectionState);

      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.closePeerConnection(peerId);
      }
    };

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      this.emit('ice-connection-state', peerId, pc.iceConnectionState);
    };

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const pc = await this.createPeerConnection(peerId);
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const pc = await this.createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async addIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  setLocalStream(stream: MediaStream): void {
    this.localStream = stream;

    // Add tracks to all existing peer connections
    this.peerConnections.forEach((pc) => {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    });
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack): void {
    this.peerConnections.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track === oldTrack);
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  }

  closePeerConnection(peerId: string): void {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
      this.emit('peer-disconnected', peerId);
    }
  }

  closeAllConnections(): void {
    this.peerConnections.forEach((pc) => {
      pc.close();
    });
    this.peerConnections.clear();
  }

  getPeerConnection(peerId: string): RTCPeerConnection | undefined {
    return this.peerConnections.get(peerId);
  }

  getAllPeerIds(): string[] {
    return Array.from(this.peerConnections.keys());
  }

  destroy(): void {
    this.closeAllConnections();
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.removeAllListeners();
  }
}
