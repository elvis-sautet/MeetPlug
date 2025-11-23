# Changelog

All notable changes to MeetPlug will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-23

### Added
- 🎉 Initial release of MeetPlug
- Real-time video and audio streaming using WebRTC
- Screen sharing capabilities
- Chat messaging system
- Prebuilt React UI components:
  - `MeetPlugRoom` - Complete meeting room interface
  - `VideoGrid` - Flexible video grid with multiple layouts
  - `MeetPlugControls` - Media control bar
  - `ChatPanel` - Chat interface
  - `ParticipantList` - Participant management
- React Hooks for custom UIs:
  - `useMeetPlug` - Main meeting functionality
  - `useMedia` - Media device management
  - `useRoom` - Room management
- Core SDK (`MeetPlugSDK`) for vanilla JavaScript usage
- TypeScript support with full type definitions
- Customizable theming with Tailwind CSS
- Framework-agnostic design (works with React, Vue, Next.js, vanilla JS)
- Comprehensive documentation and examples
- Production-ready build system
- ES modules and UMD bundle formats
- Lightweight package (<200KB)

### Technical Details
- WebRTC for peer-to-peer communication
- Socket.io for signaling
- EventEmitter3 for event handling
- Full TypeScript support
- Tailwind CSS with custom prefix (`mp-`)
- Vite for fast builds
- Source maps for debugging

### Documentation
- Comprehensive README with API documentation
- React and vanilla JavaScript examples
- Usage guides and best practices
- Customization and theming guide

[1.0.0]: https://github.com/elvis-sautet/MeetPlug/releases/tag/v1.0.0
