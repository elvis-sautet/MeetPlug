# MeetPlug Examples

This directory contains example implementations of MeetPlug in different contexts.

## 📁 Examples

### 1. React Example (`react-example/`)

#### Basic Usage (`App.tsx`)
Simple React app showing the easiest way to use MeetPlug with the prebuilt `<MeetPlugRoom />` component.

**Features:**
- Room ID input
- Participant name input
- Join/leave meeting
- Full meeting UI out of the box

#### Custom UI (`CustomUI.tsx`)
Advanced example showing how to build a completely custom UI using MeetPlug hooks.

**Features:**
- Custom header and styling
- Meeting statistics display
- Using `useMeetPlug` and `useMedia` hooks
- Custom controls layout

### 2. Vanilla JavaScript Example (`vanilla-js/`)

Pure JavaScript implementation without any framework.

**Features:**
- No build tools required
- Direct SDK usage
- Manual video element management
- Event-driven architecture

## 🚀 Running the Examples

### React Example

```bash
cd examples/react-example

# Install dependencies
npm install

# Run development server
npm run dev
```

### Vanilla JS Example

Simply open `index.html` in a modern web browser. No build step required!

Or use a simple HTTP server:

```bash
cd examples/vanilla-js
python -m http.server 8000
# Visit http://localhost:8000
```

## 📝 Key Concepts Demonstrated

### 1. Basic Setup
- Installing and importing MeetPlug
- Initializing the SDK
- Configuring options

### 2. Joining Meetings
- Creating/joining rooms
- Setting participant names
- Handling join errors

### 3. Media Controls
- Toggle audio/video
- Screen sharing
- Device switching

### 4. Event Handling
- Participant join/leave
- Stream management
- Chat messages

### 5. Custom UI
- Using hooks for state management
- Building custom components
- Integrating with existing apps

## 🔧 Customization Tips

1. **Theming**: Modify CSS classes to match your brand
2. **Layout**: Choose between grid, spotlight, or sidebar layouts
3. **Features**: Enable/disable chat, screen share, etc.
4. **Signaling**: Connect to your own signaling server

## 📚 Learn More

- [Full Documentation](../../README.md)
- [API Reference](../../README.md#-api-documentation)
- [GitHub Repository](https://github.com/elvis-sautet/MeetPlug)
