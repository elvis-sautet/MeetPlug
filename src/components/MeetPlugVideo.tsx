import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, VideoOff, Hand } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import type { Participant } from '../types';

interface MeetPlugVideoProps {
  participant: Participant;
  className?: string;
  showName?: boolean;
  mirror?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MeetPlugVideo: React.FC<MeetPlugVideoProps> = ({
  participant,
  className = '',
  showName = true,
  mirror = false,
  size = 'md',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.videoEnabled]);

  const sizeClasses = {
    sm: 'mp-h-32',
    md: 'mp-h-48',
    lg: 'mp-h-full',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'mp-relative mp-w-full mp-overflow-hidden mp-rounded-lg mp-bg-muted mp-group',
        sizeClasses[size],
        className
      )}
    >
      {/* Video Stream */}
      {participant.videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          className={cn(
            'mp-w-full mp-h-full mp-object-cover',
            mirror && 'mp-scale-x-[-1]'
          )}
        />
      ) : (
        /* Avatar when video is off */
        <div className="mp-absolute mp-inset-0 mp-flex mp-items-center mp-justify-center mp-bg-gradient-to-br mp-from-primary/20 mp-to-secondary/20">
          <Avatar className="mp-w-20 mp-h-20">
            <AvatarFallback className="mp-text-2xl mp-font-bold mp-bg-primary mp-text-primary-foreground">
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Reaction Overlay */}
      {participant.reaction && (
        <div className="mp-absolute mp-top-4 mp-right-4 mp-text-4xl mp-animate-fade-in">
          {participant.reaction}
        </div>
      )}

      {/* Raised Hand Indicator */}
      {participant.handRaised && (
        <div className="mp-absolute mp-top-2 mp-left-2">
          <Badge variant="default" className="mp-bg-yellow-500 mp-text-black mp-gap-1">
            <Hand className="mp-w-3 mp-h-3" />
            <span className="mp-text-xs">Hand Raised</span>
          </Badge>
        </div>
      )}

      {/* Screen Share Indicator */}
      {participant.screenShareEnabled && (
        <div className="mp-absolute mp-top-2 mp-left-2">
          <Badge variant="default" className="mp-bg-green-500">
            <span className="mp-text-xs">Sharing Screen</span>
          </Badge>
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="mp-absolute mp-bottom-0 mp-left-0 mp-right-0 mp-bg-gradient-to-t mp-from-black/80 mp-to-transparent mp-p-3">
        <div className="mp-flex mp-items-center mp-justify-between">
          {/* Participant Name */}
          {showName && (
            <div className="mp-flex mp-items-center mp-gap-2 mp-flex-1 mp-min-w-0">
              <span className="mp-text-white mp-text-sm mp-font-medium mp-truncate">
                {participant.name || 'Guest'}
                {participant.isLocal && ' (You)'}
              </span>
              {participant.isMutedByHost && (
                <Badge variant="destructive" className="mp-text-xs mp-px-1 mp-py-0">
                  Host Muted
                </Badge>
              )}
            </div>
          )}

          {/* Status Icons */}
          <div className="mp-flex mp-items-center mp-gap-1.5">
            {/* Audio Status */}
            {participant.audioEnabled ? (
              <div className="mp-p-1 mp-rounded-md mp-bg-background/20">
                <Mic className="mp-w-3.5 mp-h-3.5 mp-text-white" />
              </div>
            ) : (
              <div className="mp-p-1 mp-rounded-md mp-bg-destructive/80">
                <MicOff className="mp-w-3.5 mp-h-3.5 mp-text-white" />
              </div>
            )}

            {/* Video Status */}
            {!participant.videoEnabled && (
              <div className="mp-p-1 mp-rounded-md mp-bg-destructive/80">
                <VideoOff className="mp-w-3.5 mp-h-3.5 mp-text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Overlay for interaction (optional) */}
      <div className="mp-absolute mp-inset-0 mp-bg-black/0 group-hover:mp-bg-black/10 mp-transition-colors mp-pointer-events-none" />
    </div>
  );
};
