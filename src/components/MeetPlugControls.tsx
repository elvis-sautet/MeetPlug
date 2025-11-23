import React from 'react';
import type { ControlsBarProps } from '../types';

export const MeetPlugControls: React.FC<ControlsBarProps> = ({
  audioEnabled,
  videoEnabled,
  screenShareEnabled,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveRoom,
  className = '',
}) => {
  return (
    <div className={`mp-flex mp-items-center mp-justify-center mp-gap-3 mp-p-4 mp-bg-gray-900 mp-border-t mp-border-gray-800 ${className}`}>
      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        className={`mp-p-4 mp-rounded-full mp-transition-all mp-hover:scale-110 ${
          audioEnabled
            ? 'mp-bg-gray-700 mp-text-white hover:mp-bg-gray-600'
            : 'mp-bg-red-500 mp-text-white hover:mp-bg-red-600'
        }`}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? (
          <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`mp-p-4 mp-rounded-full mp-transition-all mp-hover:scale-110 ${
          videoEnabled
            ? 'mp-bg-gray-700 mp-text-white hover:mp-bg-gray-600'
            : 'mp-bg-red-500 mp-text-white hover:mp-bg-red-600'
        }`}
        title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {videoEnabled ? (
          <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        ) : (
          <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Screen Share Toggle */}
      <button
        onClick={onToggleScreenShare}
        className={`mp-p-4 mp-rounded-full mp-transition-all mp-hover:scale-110 ${
          screenShareEnabled
            ? 'mp-bg-green-500 mp-text-white hover:mp-bg-green-600'
            : 'mp-bg-gray-700 mp-text-white hover:mp-bg-gray-600'
        }`}
        title={screenShareEnabled ? 'Stop sharing' : 'Share screen'}
      >
        <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Leave Room */}
      <button
        onClick={onLeaveRoom}
        className="mp-p-4 mp-rounded-full mp-bg-red-600 mp-text-white hover:mp-bg-red-700 mp-transition-all mp-hover:scale-110"
        title="Leave meeting"
      >
        <svg className="mp-w-6 mp-h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
