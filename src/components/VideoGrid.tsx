import React from 'react';
import { MeetPlugVideo } from './MeetPlugVideo';
import type { VideoGridProps } from '../types';

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localParticipant,
  layout = 'grid',
  className = '',
}) => {
  const allParticipants = localParticipant
    ? [localParticipant, ...participants]
    : participants;

  const getGridLayout = (count: number): string => {
    if (count === 1) return 'mp-grid-cols-1';
    if (count === 2) return 'mp-grid-cols-2';
    if (count <= 4) return 'mp-grid-cols-2 mp-grid-rows-2';
    if (count <= 6) return 'mp-grid-cols-3 mp-grid-rows-2';
    if (count <= 9) return 'mp-grid-cols-3 mp-grid-rows-3';
    return 'mp-grid-cols-4';
  };

  if (layout === 'spotlight') {
    const [spotlight, ...others] = allParticipants;

    return (
      <div className={`mp-flex mp-flex-col mp-h-full mp-gap-2 ${className}`}>
        <div className="mp-flex-1">
          {spotlight && <MeetPlugVideo participant={spotlight} mirror={spotlight.isLocal} />}
        </div>

        {others.length > 0 && (
          <div className="mp-h-32 mp-flex mp-gap-2 mp-overflow-x-auto">
            {others.map((participant) => (
              <div key={participant.id} className="mp-w-48 mp-flex-shrink-0">
                <MeetPlugVideo participant={participant} mirror={participant.isLocal} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (layout === 'sidebar') {
    const [main, ...sidebar] = allParticipants;

    return (
      <div className={`mp-flex mp-h-full mp-gap-2 ${className}`}>
        <div className="mp-flex-1">
          {main && <MeetPlugVideo participant={main} mirror={main.isLocal} />}
        </div>

        {sidebar.length > 0 && (
          <div className="mp-w-64 mp-flex mp-flex-col mp-gap-2 mp-overflow-y-auto">
            {sidebar.map((participant) => (
              <div key={participant.id} className="mp-aspect-video">
                <MeetPlugVideo participant={participant} mirror={participant.isLocal} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className={`mp-grid mp-gap-2 mp-h-full mp-p-2 ${getGridLayout(allParticipants.length)} ${className}`}>
      {allParticipants.map((participant) => (
        <div key={participant.id} className="mp-aspect-video">
          <MeetPlugVideo participant={participant} mirror={participant.isLocal} />
        </div>
      ))}
    </div>
  );
};
