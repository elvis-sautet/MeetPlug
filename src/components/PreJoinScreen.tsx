import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface PreJoinScreenProps {
  onJoin: (options: { name: string; audio: boolean; video: boolean }) => void;
  defaultName?: string;
  className?: string;
}

export const PreJoinScreen: React.FC<PreJoinScreenProps> = ({
  onJoin,
  defaultName = '',
  className = '',
}) => {
  const [name, setName] = useState(defaultName);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize preview stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initPreview = async () => {
      try {
        if (videoEnabled || audioEnabled) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoEnabled,
            audio: audioEnabled,
          });
          setPreviewStream(stream);

          if (videoRef.current && videoEnabled) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Error accessing media:', error);
      }
    };

    initPreview();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoEnabled, audioEnabled]);

  // Update video preview when stream changes
  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const handleJoin = () => {
    setIsLoading(true);
    // Stop preview stream
    if (previewStream) {
      previewStream.getTracks().forEach((track) => track.stop());
    }
    onJoin({ name: name || 'Guest', audio: audioEnabled, video: videoEnabled });
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('mp-flex mp-items-center mp-justify-center mp-min-h-screen mp-bg-background mp-p-4', className)}>
      <Card className="mp-w-full mp-max-w-2xl">
        <CardHeader>
          <CardTitle className="mp-text-2xl">Join Meeting</CardTitle>
          <CardDescription>Set up your audio and video before joining</CardDescription>
        </CardHeader>
        <CardContent className="mp-space-y-6">
          {/* Video Preview */}
          <div className="mp-relative mp-aspect-video mp-bg-muted mp-rounded-lg mp-overflow-hidden">
            {videoEnabled && previewStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="mp-w-full mp-h-full mp-object-cover mp-scale-x-[-1]"
              />
            ) : (
              <div className="mp-absolute mp-inset-0 mp-flex mp-flex-col mp-items-center mp-justify-center mp-bg-gradient-to-br mp-from-primary/20 mp-to-secondary/20">
                <Avatar className="mp-w-24 mp-h-24 mp-mb-4">
                  <AvatarFallback className="mp-text-4xl mp-font-bold mp-bg-primary mp-text-primary-foreground">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <p className="mp-text-muted-foreground mp-text-sm">Camera is off</p>
              </div>
            )}

            {/* Status Badges */}
            <div className="mp-absolute mp-top-4 mp-right-4 mp-flex mp-gap-2">
              {!audioEnabled && (
                <Badge variant="destructive" className="mp-gap-1">
                  <MicOff className="mp-w-3 mp-h-3" />
                  Muted
                </Badge>
              )}
              {!videoEnabled && (
                <Badge variant="destructive" className="mp-gap-1">
                  <VideoOff className="mp-w-3 mp-h-3" />
                  Camera Off
                </Badge>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="mp-space-y-2">
            <label htmlFor="name" className="mp-text-sm mp-font-medium">
              Your Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mp-w-full"
            />
          </div>

          {/* Media Controls */}
          <div className="mp-flex mp-items-center mp-justify-center mp-gap-3">
            {/* Audio Toggle */}
            <Button
              variant={audioEnabled ? 'secondary' : 'destructive'}
              size="icon"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={cn(
                'mp-rounded-full mp-w-12 mp-h-12',
                !audioEnabled && 'mp-bg-destructive hover:mp-bg-destructive/90'
              )}
              title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
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
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={cn(
                'mp-rounded-full mp-w-12 mp-h-12',
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

            {/* Settings (placeholder) */}
            <Button
              variant="outline"
              size="icon"
              className="mp-rounded-full mp-w-12 mp-h-12"
              title="Settings"
            >
              <Settings className="mp-w-5 mp-h-5" />
            </Button>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={!name.trim() || isLoading}
            className="mp-w-full mp-h-12 mp-text-base"
            size="lg"
          >
            {isLoading ? 'Joining...' : 'Join Meeting'}
          </Button>

          {/* Info Text */}
          <p className="mp-text-center mp-text-sm mp-text-muted-foreground">
            {!audioEnabled && !videoEnabled
              ? 'You will join with audio and video off'
              : !audioEnabled
              ? 'You will join with audio off'
              : !videoEnabled
              ? 'You will join with video off'
              : 'You will join with audio and video on'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
