import React, { useEffect, useRef } from 'react';
import type { Participant } from '../types';

interface MeetPlugVideoProps {
  participant: Participant;
  className?: string;
  showName?: boolean;
  mirror?: boolean;
}

export const MeetPlugVideo: React.FC<MeetPlugVideoProps> = ({
  participant,
  className = '',
  showName = true,
  mirror = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.videoEnabled]);

  return (
    <div className={`mp-relative mp-w-full mp-h-full mp-bg-gray-900 mp-rounded-lg mp-overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={participant.isLocal}
        className={`mp-w-full mp-h-full mp-object-cover ${mirror ? 'mp-scale-x-[-1]' : ''}`}
        style={{ display: participant.videoEnabled ? 'block' : 'none' }}
      />

      {!participant.videoEnabled && (
        <div className="mp-absolute mp-inset-0 mp-flex mp-items-center mp-justify-center mp-bg-gray-800">
          <div className="mp-w-20 mp-h-20 mp-rounded-full mp-bg-gradient-to-br mp-from-blue-500 mp-to-purple-600 mp-flex mp-items-center mp-justify-center mp-text-white mp-text-3xl mp-font-bold">
            {participant.name?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      )}

      {showName && (
        <div className="mp-absolute mp-bottom-2 mp-left-2 mp-px-3 mp-py-1 mp-bg-black/60 mp-backdrop-blur-sm mp-rounded-full mp-flex mp-items-center mp-gap-2">
          <span className="mp-text-white mp-text-sm mp-font-medium">
            {participant.name || 'Guest'}
            {participant.isLocal && ' (You)'}
          </span>

          {!participant.audioEnabled && (
            <svg className="mp-w-4 mp-h-4 mp-text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}

      {participant.screenShareEnabled && (
        <div className="mp-absolute mp-top-2 mp-right-2 mp-px-2 mp-py-1 mp-bg-green-500 mp-rounded mp-text-white mp-text-xs mp-font-semibold">
          Screen Sharing
        </div>
      )}
    </div>
  );
};
