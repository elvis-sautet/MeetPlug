import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Hand,
  PhoneOff,
  Smile,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import type { ControlsBarProps, ReactionType } from '../types';

interface ExtendedControlsBarProps extends ControlsBarProps {
  onToggleRaiseHand?: () => void;
  onSendReaction?: (reaction: ReactionType) => void;
  handRaised?: boolean;
}

const reactions: ReactionType[] = ['👍', '❤️', '😂', '🎉', '👏', '🔥'];

export const MeetPlugControls: React.FC<ExtendedControlsBarProps> = ({
  audioEnabled,
  videoEnabled,
  screenShareEnabled,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveRoom,
  onToggleRaiseHand,
  onSendReaction,
  handRaised = false,
  className = '',
}) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={cn(
        'mp-relative mp-flex mp-items-center mp-justify-between mp-px-6 mp-py-4 mp-bg-card mp-border-t mp-border-border',
        className
      )}
    >
      {/* Left Section - Room Info */}
      <div className="mp-flex mp-items-center mp-gap-2">
        <Badge variant="outline" className="mp-text-xs">
          <div className="mp-w-2 mp-h-2 mp-rounded-full mp-bg-green-500 mp-mr-2 mp-animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Center Section - Main Controls */}
      <div className="mp-flex mp-items-center mp-gap-2">
        {/* Audio Toggle */}
        <Button
          variant={audioEnabled ? 'secondary' : 'destructive'}
          size="icon"
          onClick={onToggleAudio}
          className={cn(
            'mp-rounded-full mp-w-12 mp-h-12 mp-transition-all hover:mp-scale-105',
            !audioEnabled && 'mp-bg-destructive hover:mp-bg-destructive/90'
          )}
          title={audioEnabled ? 'Mute' : 'Unmute'}
        >
          {audioEnabled ? (
            <Mic className="mp-w-5 mp-h-5" />
          ) : (
            <MicOff className="mp-w-5 mp-h-5" />
          )}
        </Button>

        {/* Video Toggle */}
        <Button
          variant={videoEnabled ? 'secondary' : 'destructive'}
          size="icon"
          onClick={onToggleVideo}
          className={cn(
            'mp-rounded-full mp-w-12 mp-h-12 mp-transition-all hover:mp-scale-105',
            !videoEnabled && 'mp-bg-destructive hover:mp-bg-destructive/90'
          )}
          title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoEnabled ? (
            <Video className="mp-w-5 mp-h-5" />
          ) : (
            <VideoOff className="mp-w-5 mp-h-5" />
          )}
        </Button>

        {/* Screen Share Toggle */}
        <Button
          variant={screenShareEnabled ? 'default' : 'secondary'}
          size="icon"
          onClick={onToggleScreenShare}
          className="mp-rounded-full mp-w-12 mp-h-12 mp-transition-all hover:mp-scale-105"
          title={screenShareEnabled ? 'Stop sharing' : 'Share screen'}
        >
          {screenShareEnabled ? (
            <MonitorOff className="mp-w-5 mp-h-5" />
          ) : (
            <Monitor className="mp-w-5 mp-h-5" />
          )}
        </Button>

        {/* Raise Hand */}
        {onToggleRaiseHand && (
          <Button
            variant={handRaised ? 'default' : 'outline'}
            size="icon"
            onClick={onToggleRaiseHand}
            className={cn(
              'mp-rounded-full mp-w-12 mp-h-12 mp-transition-all hover:mp-scale-105',
              handRaised && 'mp-bg-yellow-500 hover:mp-bg-yellow-600 mp-text-black'
            )}
            title={handRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand className="mp-w-5 mp-h-5" />
          </Button>
        )}

        {/* Reactions */}
        {onSendReaction && (
          <div className="mp-relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowReactions(!showReactions)}
              className="mp-rounded-full mp-w-12 mp-h-12 mp-transition-all hover:mp-scale-105"
              title="Send reaction"
            >
              <Smile className="mp-w-5 mp-h-5" />
            </Button>

            {/* Reactions Popover */}
            {showReactions && (
              <div className="mp-absolute mp-bottom-full mp-left-1/2 mp-transform mp--translate-x-1/2 mp-mb-2 mp-p-2 mp-bg-card mp-border mp-border-border mp-rounded-lg mp-shadow-lg mp-animate-fade-in">
                <div className="mp-flex mp-gap-1">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => {
                        onSendReaction(reaction);
                        setShowReactions(false);
                      }}
                      className="mp-text-2xl mp-p-2 mp-rounded-md hover:mp-bg-accent mp-transition-colors"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leave Meeting */}
        <Button
          variant="destructive"
          size="icon"
          onClick={onLeaveRoom}
          className="mp-rounded-full mp-w-12 mp-h-12 mp-ml-4 mp-transition-all hover:mp-scale-105"
          title="Leave meeting"
        >
          <PhoneOff className="mp-w-5 mp-h-5" />
        </Button>
      </div>

      {/* Right Section - More Options */}
      <div className="mp-flex mp-items-center mp-gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="mp-rounded-full"
          title="More options"
        >
          <MoreVertical className="mp-w-5 mp-h-5" />
        </Button>
      </div>

      {/* Close reactions when clicking outside */}
      {showReactions && (
        <div
          className="mp-fixed mp-inset-0 mp-z-0"
          onClick={() => setShowReactions(false)}
        />
      )}
    </div>
  );
};
