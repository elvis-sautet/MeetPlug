// Styles
import './styles/index.css';

// Core SDK
export { MeetPlugSDK } from './core/MeetPlugSDK';
export { SignalingClient } from './core/SignalingClient';
export { WebRTCManager } from './core/WebRTCManager';

// React Components
export {
  MeetPlugRoom,
  MeetPlugVideo,
  MeetPlugControls,
  VideoGrid,
  ChatPanel,
  ParticipantList,
} from './components';

// React Hooks
export { useMeetPlug, useMedia, useRoom } from './hooks';

// Types
export type {
  MeetPlugConfig,
  Room,
  Participant,
  ChatMessage,
  MediaConstraints,
  MediaDevices,
  MeetPlugEvents,
  SignalingMessage,
  JoinRoomPayload,
  MediaStatePayload,
  MeetPlugRoomProps,
  VideoGridProps,
  ControlsBarProps,
  ChatPanelProps,
  ParticipantListProps,
  UseMeetPlugReturn,
  UseMediaReturn,
  UseRoomReturn,
} from './types';

// Default export for convenience
export { MeetPlugSDK as default } from './core/MeetPlugSDK';
