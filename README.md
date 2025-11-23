# 🎥 MeetPlug

**A lightweight, installable NPM package for real-time meeting and collaboration features in web applications.**

[![npm version](https://img.shields.io/npm/v/meetplug.svg)](https://www.npmjs.com/package/meetplug)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

MeetPlug provides a simple SDK + ready-made UI components that developers can embed directly inside React apps, Vue apps, Next.js, or plain JavaScript projects. Built on WebRTC for peer-to-peer communication.

## ✨ Features

- 🎬 **Real-time video and audio streaming**
- 🖥️ **Screen sharing**
- 💬 **Chat messaging**
- 🧩 **Prebuilt UI components** (VideoGrid, ControlsBar, ChatPanel)
- 🎣 **React Hooks** for custom UIs
- 🔌 **Framework-agnostic** (React, Vue, Next.js, vanilla JS)
- 📦 **Lightweight** (<200KB gzipped)
- 🎨 **Customizable theming**
- 🔐 **Type-safe with TypeScript**
- 🌐 **WebRTC-based** (no external dependencies for media)

## 📦 Installation

```bash
npm install meetplug
# or
yarn add meetplug
# or
pnpm add meetplug
```

## 🚀 Quick Start

### React Component (Easiest)

```tsx
import { MeetPlugRoom } from 'meetplug';
import 'meetplug/dist/style.css';

function App() {
  return (
    <MeetPlugRoom
      roomId="my-meeting-room"
      participantName="John Doe"
      onJoin={(room) => console.log('Joined:', room)}
      onLeave={() => console.log('Left meeting')}
    />
  );
}
```

### Using React Hooks (Custom UI)

```tsx
import { useMeetPlug, useMedia } from 'meetplug';
import 'meetplug/dist/style.css';

function CustomMeeting() {
  const {
    room,
    participants,
    isConnected,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    chatMessages
  } = useMeetPlug();

  const {
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare
  } = useMedia(null);

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => joinRoom('room-123', 'My Name')}>
          Join Meeting
        </button>
      ) : (
        <>
          <div>Participants: {participants.length + 1}</div>
          <button onClick={toggleAudio}>
            {audioEnabled ? 'Mute' : 'Unmute'}
          </button>
          <button onClick={toggleVideo}>
            {videoEnabled ? 'Stop Video' : 'Start Video'}
          </button>
          <button onClick={leaveRoom}>Leave</button>
        </>
      )}
    </div>
  );
}
```

### Vanilla JavaScript

```javascript
import MeetPlugSDK from 'meetplug';
import 'meetplug/dist/style.css';

const sdk = new MeetPlugSDK({
  signalingServer: 'ws://localhost:3001',
  enableChat: true,
  enableScreenShare: true
});

// Join a room
await sdk.joinRoom('my-room-id', 'Participant Name');

// Listen to events
sdk.on('room:joined', (room) => {
  console.log('Joined room:', room);
});

sdk.on('participant:joined', (participant) => {
  console.log('New participant:', participant);
});

// Toggle audio/video
await sdk.toggleAudio();
await sdk.toggleVideo();

// Share screen
await sdk.toggleScreenShare();

// Send chat message
sdk.sendChatMessage('Hello everyone!');

// Leave room
sdk.leaveRoom();
```

## 📚 API Documentation

### Components

#### `<MeetPlugRoom />`

Main container component with everything built-in.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `roomId` | `string` | required | Unique room identifier |
| `participantName` | `string` | `'Guest'` | Display name for the user |
| `config` | `MeetPlugConfig` | `{}` | SDK configuration |
| `onJoin` | `(room: Room) => void` | - | Called when joined |
| `onLeave` | `() => void` | - | Called when left |
| `onError` | `(error: Error) => void` | - | Called on errors |
| `className` | `string` | `''` | Additional CSS classes |
| `theme` | `'light' \| 'dark'` | `'dark'` | UI theme |

#### `<VideoGrid />`

Displays video streams in a grid layout.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `participants` | `Participant[]` | required | Array of participants |
| `localParticipant` | `Participant` | - | Local user |
| `layout` | `'grid' \| 'sidebar' \| 'spotlight'` | `'grid'` | Layout mode |
| `className` | `string` | `''` | Additional CSS classes |

#### `<MeetPlugControls />`

Control bar with media controls.

#### `<ChatPanel />`

Chat interface with message history.

#### `<ParticipantList />`

List of all participants with status.

### Hooks

#### `useMeetPlug(config?: MeetPlugConfig)`

Main hook for meeting functionality.

**Returns:**

```typescript
{
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
```

#### `useMedia(sdk: MeetPlugSDK | null)`

Hook for media device management.

**Returns:**

```typescript
{
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
```

#### `useRoom(sdk: MeetPlugSDK | null)`

Hook for room management.

**Returns:**

```typescript
{
  room: Room | null;
  participants: Participant[];
  isHost: boolean;
  kickParticipant: (participantId: string) => void;
  updateRoomSettings: (settings: Partial<Room>) => void;
}
```

### MeetPlugSDK Class

Core SDK class for vanilla JS usage.

#### Constructor

```typescript
new MeetPlugSDK(config?: MeetPlugConfig)
```

**Config Options:**

```typescript
interface MeetPlugConfig {
  signalingServer?: string;          // Default: 'ws://localhost:3001'
  iceServers?: RTCIceServer[];       // STUN/TURN servers
  autoConnect?: boolean;              // Default: true
  enableChat?: boolean;               // Default: true
  enableScreenShare?: boolean;        // Default: true
  maxParticipants?: number;          // Default: 50
}
```

#### Methods

- `joinRoom(roomId: string, participantName?: string): Promise<Room>`
- `leaveRoom(): void`
- `toggleAudio(): Promise<void>`
- `toggleVideo(): Promise<void>`
- `toggleScreenShare(): Promise<void>`
- `sendChatMessage(content: string): void`
- `getRoom(): Room | null`
- `getParticipants(): Participant[]`
- `getLocalStream(): MediaStream | null`

#### Events

```typescript
sdk.on('room:joined', (room: Room) => {});
sdk.on('room:left', () => {});
sdk.on('participant:joined', (participant: Participant) => {});
sdk.on('participant:left', (participantId: string) => {});
sdk.on('chat:message', (message: ChatMessage) => {});
sdk.on('stream:added', (participantId: string, stream: MediaStream) => {});
sdk.on('screen:sharing:started', (participantId: string) => {});
```

## 🎨 Customization

### Theming

MeetPlug uses Tailwind CSS with a custom prefix (`mp-`). You can customize colors in your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'meetplug': {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          // ... customize more colors
        },
      },
    },
  },
};
```

### Custom CSS

Override styles by targeting the `mp-` prefixed classes:

```css
.mp-bg-gray-900 {
  background-color: #your-color !important;
}
```

## 🔧 Advanced Usage

### Custom Signaling Server

By default, MeetPlug uses WebSocket signaling. For production, deploy your own signaling server:

```typescript
const sdk = new MeetPlugSDK({
  signalingServer: 'wss://your-server.com'
});
```

### Using TURN Servers

For production environments where peers might be behind firewalls:

```typescript
const sdk = new MeetPlugSDK({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'user',
      credential: 'pass'
    }
  ]
});
```

## 📱 Browser Support

- Chrome 74+
- Firefox 66+
- Safari 12.1+
- Edge 79+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © MeetPlug

## 🙏 Acknowledgments

Built with:
- WebRTC for peer-to-peer communication
- Socket.io for signaling
- React for UI components
- Tailwind CSS for styling
- TypeScript for type safety

## 📞 Support

- 📧 Email: support@meetplug.com
- 🐛 Issues: [GitHub Issues](https://github.com/elvis-sautet/MeetPlug/issues)
- 📖 Docs: [Documentation](https://meetplug.dev/docs)

---

**Made with ❤️ by the MeetPlug Team**
