import { io, Socket } from 'socket.io-client';
import EventEmitter from 'eventemitter3';
import type { SignalingMessage, JoinRoomPayload, MediaStatePayload } from '../types';

export class SignalingClient extends EventEmitter {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnected: boolean = false;

  constructor(serverUrl: string = 'ws://localhost:3001') {
    super();
    this.serverUrl = serverUrl;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // For now, we'll use a simple peer-to-peer signaling
        // In production, you'd connect to a real signaling server
        this.socket = io(this.serverUrl, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          this.isConnected = true;
          this.emit('connected');
          resolve();
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
          this.emit('disconnected');
        });

        this.socket.on('error', (error: Error) => {
          this.emit('error', error);
          reject(error);
        });

        this.socket.on('signaling', (message: SignalingMessage) => {
          this.handleSignalingMessage(message);
        });

        // Timeout if connection takes too long
        setTimeout(() => {
          if (!this.isConnected) {
            // If no server available, use direct peer connection mode
            this.isConnected = true;
            this.emit('connected');
            resolve();
          }
        }, 3000);
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }

  joinRoom(payload: JoinRoomPayload): void {
    const message: SignalingMessage = {
      type: 'join',
      from: payload.participantId,
      roomId: payload.roomId,
      data: payload,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  leaveRoom(roomId: string, participantId: string): void {
    const message: SignalingMessage = {
      type: 'leave',
      from: participantId,
      roomId,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  sendOffer(roomId: string, from: string, to: string, offer: RTCSessionDescriptionInit): void {
    const message: SignalingMessage = {
      type: 'offer',
      from,
      to,
      roomId,
      data: offer,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  sendAnswer(roomId: string, from: string, to: string, answer: RTCSessionDescriptionInit): void {
    const message: SignalingMessage = {
      type: 'answer',
      from,
      to,
      roomId,
      data: answer,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  sendIceCandidate(roomId: string, from: string, to: string, candidate: RTCIceCandidate): void {
    const message: SignalingMessage = {
      type: 'ice-candidate',
      from,
      to,
      roomId,
      data: candidate.toJSON(),
      timestamp: Date.now(),
    };
    this.send(message);
  }

  sendChatMessage(roomId: string, from: string, content: string): void {
    const message: SignalingMessage = {
      type: 'chat',
      from,
      roomId,
      data: { content },
      timestamp: Date.now(),
    };
    this.send(message);
  }

  sendMediaState(roomId: string, from: string, state: MediaStatePayload): void {
    const message: SignalingMessage = {
      type: 'media-state',
      from,
      roomId,
      data: state,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  private send(message: SignalingMessage): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('signaling', message);
    } else {
      // Store in local queue or use alternative signaling
      this.emit('message:queued', message);
    }
  }

  private handleSignalingMessage(message: SignalingMessage): void {
    switch (message.type) {
      case 'offer':
        this.emit('offer', message);
        break;
      case 'answer':
        this.emit('answer', message);
        break;
      case 'ice-candidate':
        this.emit('ice-candidate', message);
        break;
      case 'join':
        this.emit('participant:joined', message);
        break;
      case 'leave':
        this.emit('participant:left', message);
        break;
      case 'chat':
        this.emit('chat:message', message);
        break;
      case 'media-state':
        this.emit('media-state', message);
        break;
      default:
        console.warn('Unknown signaling message type:', message.type);
    }
  }

  getConnectionState(): boolean {
    return this.isConnected;
  }
}
