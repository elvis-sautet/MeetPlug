import React from 'react';
import type { ParticipantListProps } from '../types';

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  currentUserId,
  className = '',
}) => {
  return (
    <div className={`mp-bg-gray-900 mp-rounded-lg mp-overflow-hidden ${className}`}>
      {/* Header */}
      <div className="mp-px-4 mp-py-3 mp-border-b mp-border-gray-800">
        <h3 className="mp-text-white mp-font-semibold mp-flex mp-items-center mp-gap-2">
          <svg className="mp-w-5 mp-h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Participants ({participants.length})
        </h3>
      </div>

      {/* Participant List */}
      <div className="mp-overflow-y-auto mp-max-h-96">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentUserId;

          return (
            <div
              key={participant.id}
              className="mp-px-4 mp-py-3 mp-border-b mp-border-gray-800 mp-hover:bg-gray-800 mp-transition-colors"
            >
              <div className="mp-flex mp-items-center mp-gap-3">
                {/* Avatar */}
                <div className="mp-w-10 mp-h-10 mp-rounded-full mp-bg-gradient-to-br mp-from-blue-500 mp-to-purple-600 mp-flex mp-items-center mp-justify-center mp-text-white mp-font-semibold">
                  {participant.name?.charAt(0).toUpperCase() || '?'}
                </div>

                {/* Info */}
                <div className="mp-flex-1 mp-min-w-0">
                  <div className="mp-flex mp-items-center mp-gap-2">
                    <span className="mp-text-white mp-font-medium mp-truncate">
                      {participant.name || 'Guest'}
                      {isCurrentUser && ' (You)'}
                    </span>
                    {participant.isLocal && (
                      <span className="mp-px-2 mp-py-0.5 mp-bg-green-500 mp-text-white mp-text-xs mp-rounded-full">
                        Host
                      </span>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="mp-flex mp-items-center mp-gap-2 mp-mt-1">
                    {participant.audioEnabled ? (
                      <svg className="mp-w-4 mp-h-4 mp-text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="mp-w-4 mp-h-4 mp-text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                    )}

                    {participant.videoEnabled ? (
                      <svg className="mp-w-4 mp-h-4 mp-text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    ) : (
                      <svg className="mp-w-4 mp-h-4 mp-text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                    )}

                    {participant.screenShareEnabled && (
                      <span className="mp-text-xs mp-text-green-500 mp-font-medium">
                        Sharing screen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
