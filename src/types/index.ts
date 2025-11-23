// Core Types
export interface MeetPlugConfig {
  signalingServer?: string;
  iceServers?: RTCIceServer[];
  autoConnect?: boolean;
  enableChat?: boolean;
  enableScreenShare?: boolean;
  maxParticipants?: number;
  theme?: 'light' | 'dark' | 'system';
  enableReactions?: boolean;
  enableRaiseHand?: boolean;
}

export interface Room {
  id: string;
  name?: string;
  participants: Participant[];
  createdAt: Date;
  hostId?: string;
}

export interface Participant {
  id: string;
  name?: string;
  isLocal: boolean;
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  joinedAt: Date;
  handRaised: boolean;
  isMutedByHost: boolean;
  reaction?: ReactionType;
}

export type ReactionType = '👍' | '❤️' | '😂' | '🎉' | '👏' | '🔥' | null;

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
  mentions?: string[]; // User IDs mentioned in the message
}

// Media Types
export interface MediaConstraints {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
}

export interface MediaDevices {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
}

// Event Types
export type MeetPlugEvents = {
  'room:joined': (room: Room) => void;
  'room:left': () => void;
  'room:error': (error: Error) => void;
  'participant:joined': (participant: Participant) => void;
  'participant:left': (participantId: string) => void;
  'participant:updated': (participant: Participant) => void;
  'stream:added': (participantId: string, stream: MediaStream) => void;
  'stream:removed': (participantId: string) => void;
  'chat:message': (message: ChatMessage) => void;
  'media:changed': (devices: MediaDevices) => void;
  'connection:state': (state: RTCPeerConnectionState) => void;
  'screen:sharing:started': (participantId: string) => void;
  'screen:sharing:stopped': (participantId: string) => void;
};

// Signaling Types
export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'chat' | 'media-state';
  from: string;
  to?: string;
  roomId: string;
  data?: any;
  timestamp: number;
}

export interface JoinRoomPayload {
  roomId: string;
  participantId: string;
  participantName?: string;
}

export interface MediaStatePayload {
  participantId: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
}

// Component Props
export interface MeetPlugRoomProps {
  roomId: string;
  participantName?: string;
  config?: MeetPlugConfig;
  onJoin?: (room: Room) => void;
  onLeave?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

export interface VideoGridProps {
  participants: Participant[];
  localParticipant?: Participant;
  layout?: 'grid' | 'sidebar' | 'spotlight';
  className?: string;
}

export interface ControlsBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeaveRoom: () => void;
  className?: string;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
  className?: string;
}

export interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
  className?: string;
}

// Hook Return Types
export interface UseMeetPlugReturn {
  room: Room | null;
  localParticipant: Participant | null;
  participants: Participant[];
  isConnected: boolean;
  isJoining: boolean;
  error: Error | null;
  joinRoom: (roomId: string, participantName?: string) => Promise<void>;
  leaveRoom: () => void;
  sendChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
}

export interface UseMediaReturn {
  localStream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  devices: MediaDevices;
  toggleAudio: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  switchCamera: (deviceId: string) => Promise<void>;
  switchMicrophone: (deviceId: string) => Promise<void>;
  error: Error | null;
}

export interface UseRoomReturn {
  room: Room | null;
  participants: Participant[];
  isHost: boolean;
  kickParticipant: (participantId: string) => void;
  updateRoomSettings: (settings: Partial<Room>) => void;
}
