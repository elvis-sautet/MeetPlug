import React from 'react';
import { useMeetPlug, useMedia, VideoGrid, MeetPlugControls } from 'meetplug';
import 'meetplug/dist/style.css';

/**
 * Example of building a custom UI using MeetPlug hooks
 */
function CustomUI() {
  const {
    room,
    localParticipant,
    participants,
    isConnected,
    isJoining,
    joinRoom,
    leaveRoom,
    chatMessages,
    sendChatMessage,
  } = useMeetPlug({
    enableChat: true,
    enableScreenShare: true,
  });

  const {
    audioEnabled,
    videoEnabled,
    screenShareEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useMedia(null);

  const [showStats, setShowStats] = React.useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Custom Meeting UI</h1>
          <button
            onClick={() => joinRoom('custom-room', 'Custom User')}
            disabled={isJoining}
            className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isJoining ? 'Joining...' : 'Start Meeting'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Custom Header */}
      <header className="bg-gradient-to-r from-purple-800 to-blue-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Custom Meeting</h1>
            <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
              {participants.length + 1} participants
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              {showStats ? 'Hide' : 'Show'} Stats
            </button>
            <button
              onClick={leaveRoom}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              End Meeting
            </button>
          </div>
        </div>

        {showStats && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-300">Room ID</p>
              <p className="text-white font-mono">{room?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Chat Messages</p>
              <p className="text-white">{chatMessages.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Your Name</p>
              <p className="text-white">{localParticipant?.name}</p>
            </div>
          </div>
        )}
      </header>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <VideoGrid
          participants={participants}
          localParticipant={localParticipant || undefined}
          layout="grid"
          className="h-full"
        />
      </div>

      {/* Custom Controls */}
      <div className="bg-gray-800 border-t border-gray-700">
        <MeetPlugControls
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          screenShareEnabled={screenShareEnabled}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={toggleScreenShare}
          onLeaveRoom={leaveRoom}
        />
      </div>
    </div>
  );
}

export default CustomUI;
