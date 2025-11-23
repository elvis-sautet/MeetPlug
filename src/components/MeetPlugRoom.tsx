import React, { useRef, useState } from 'react';
import { VideoGrid } from './VideoGrid';
import { MeetPlugControls } from './MeetPlugControls';
import { ChatPanel } from './ChatPanel';
import { ParticipantList } from './ParticipantList';
import { useMeetPlug } from '../hooks/useMeetPlug';
import { useMedia } from '../hooks/useMedia';
import type { MeetPlugRoomProps } from '../types';

export const MeetPlugRoom: React.FC<MeetPlugRoomProps> = ({
  roomId,
  participantName,
  config,
  onJoin,
  onLeave,
  onError,
  className = '',
  theme = 'dark',
}) => {
  const sdkRef = useRef<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'sidebar' | 'spotlight'>('grid');

  const {
    room,
    localParticipant,
    participants,
    isConnected,
    isJoining,
    error: meetError,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    chatMessages,
  } = useMeetPlug(config);

  const {
    audioEnabled,
    videoEnabled,
    screenShareEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    error: mediaError,
  } = useMedia(sdkRef.current);

  const [hasJoined, setHasJoined] = React.useState(false);

  React.useEffect(() => {
    if (!hasJoined && roomId) {
      handleJoin();
    }
  }, [roomId, hasJoined]);

  React.useEffect(() => {
    if (meetError) {
      onError?.(meetError);
    }
  }, [meetError, onError]);

  React.useEffect(() => {
    if (mediaError) {
      onError?.(mediaError);
    }
  }, [mediaError, onError]);

  React.useEffect(() => {
    if (room && onJoin) {
      onJoin(room);
    }
  }, [room, onJoin]);

  const handleJoin = async () => {
    try {
      await joinRoom(roomId, participantName);
      setHasJoined(true);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleLeave = () => {
    leaveRoom();
    setHasJoined(false);
    onLeave?.();
  };

  if (isJoining) {
    return (
      <div className={`mp-flex mp-items-center mp-justify-center mp-h-screen mp-bg-gray-900 ${className}`}>
        <div className="mp-text-center">
          <div className="mp-w-16 mp-h-16 mp-border-4 mp-border-blue-500 mp-border-t-transparent mp-rounded-full mp-animate-spin mp-mx-auto mp-mb-4"></div>
          <p className="mp-text-white mp-text-lg">Joining meeting...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={`mp-flex mp-items-center mp-justify-center mp-h-screen mp-bg-gray-900 ${className}`}>
        <div className="mp-text-center mp-max-w-md mp-px-4">
          <svg className="mp-w-20 mp-h-20 mp-text-gray-500 mp-mx-auto mp-mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <h2 className="mp-text-white mp-text-2xl mp-font-bold mp-mb-2">Ready to join?</h2>
          <p className="mp-text-gray-400 mp-mb-6">Click the button below to join the meeting</p>
          <button
            onClick={handleJoin}
            className="mp-px-8 mp-py-3 mp-bg-blue-600 mp-text-white mp-rounded-lg mp-font-semibold hover:mp-bg-blue-700 mp-transition-colors"
          >
            Join Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mp-flex mp-flex-col mp-h-screen mp-bg-gray-900 ${theme === 'dark' ? 'mp-dark' : ''} ${className}`}>
      {/* Header */}
      <div className="mp-flex mp-items-center mp-justify-between mp-px-6 mp-py-3 mp-bg-gray-800 mp-border-b mp-border-gray-700">
        <div className="mp-flex mp-items-center mp-gap-4">
          <h1 className="mp-text-white mp-font-bold mp-text-xl">MeetPlug</h1>
          <span className="mp-px-3 mp-py-1 mp-bg-green-500 mp-text-white mp-text-sm mp-rounded-full mp-font-medium">
            Live
          </span>
          {room && (
            <span className="mp-text-gray-400 mp-text-sm">
              Room: {room.name || room.id}
            </span>
          )}
        </div>

        <div className="mp-flex mp-items-center mp-gap-2">
          {/* Layout Switcher */}
          <div className="mp-flex mp-gap-1 mp-bg-gray-700 mp-rounded-lg mp-p-1">
            <button
              onClick={() => setLayout('grid')}
              className={`mp-p-2 mp-rounded ${layout === 'grid' ? 'mp-bg-gray-600' : ''}`}
              title="Grid layout"
            >
              <svg className="mp-w-5 mp-h-5 mp-text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setLayout('spotlight')}
              className={`mp-p-2 mp-rounded ${layout === 'spotlight' ? 'mp-bg-gray-600' : ''}`}
              title="Spotlight layout"
            >
              <svg className="mp-w-5 mp-h-5 mp-text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`mp-p-2 mp-rounded-lg mp-transition-colors ${showParticipants ? 'mp-bg-blue-600' : 'mp-bg-gray-700 hover:mp-bg-gray-600'}`}
            title="Participants"
          >
            <svg className="mp-w-6 mp-h-6 mp-text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`mp-p-2 mp-rounded-lg mp-transition-colors mp-relative ${showChat ? 'mp-bg-blue-600' : 'mp-bg-gray-700 hover:mp-bg-gray-600'}`}
            title="Chat"
          >
            <svg className="mp-w-6 mp-h-6 mp-text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            {chatMessages.length > 0 && (
              <span className="mp-absolute mp-top-0 mp-right-0 mp-w-2 mp-h-2 mp-bg-red-500 mp-rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mp-flex mp-flex-1 mp-overflow-hidden">
        {/* Video Area */}
        <div className="mp-flex-1 mp-relative">
          <VideoGrid
            participants={participants}
            localParticipant={localParticipant || undefined}
            layout={layout}
            className="mp-h-full"
          />
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="mp-w-80 mp-border-l mp-border-gray-800">
            <ChatPanel
              messages={chatMessages}
              onSendMessage={sendChatMessage}
              currentUserId={localParticipant?.id || ''}
            />
          </div>
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="mp-w-80 mp-border-l mp-border-gray-800 mp-p-4 mp-overflow-y-auto">
            <ParticipantList
              participants={[...(localParticipant ? [localParticipant] : []), ...participants]}
              currentUserId={localParticipant?.id || ''}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <MeetPlugControls
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        screenShareEnabled={screenShareEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeaveRoom={handleLeave}
      />
    </div>
  );
};
