import { useState, useEffect, useCallback } from 'react';
import { MeetPlugSDK } from '../core/MeetPlugSDK';
import type { MediaDevices, UseMediaReturn } from '../types';

export function useMedia(sdk: MeetPlugSDK | null): UseMediaReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [devices, setDevices] = useState<MediaDevices>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sdk) return;

    const updateLocalStream = () => {
      const stream = sdk.getLocalStream();
      setLocalStream(stream);

      if (stream) {
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (audioTrack) setAudioEnabled(audioTrack.enabled);
        if (videoTrack) setVideoEnabled(videoTrack.enabled);
      }
    };

    const updateMediaDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          audioInputs: deviceList.filter((d) => d.kind === 'audioinput'),
          audioOutputs: deviceList.filter((d) => d.kind === 'audiooutput'),
          videoInputs: deviceList.filter((d) => d.kind === 'videoinput'),
        });
      } catch (err) {
        console.error('Error enumerating devices:', err);
      }
    };

    updateLocalStream();
    updateMediaDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', updateMediaDevices);

    sdk.on('screen:sharing:started', () => setScreenShareEnabled(true));
    sdk.on('screen:sharing:stopped', () => setScreenShareEnabled(false));

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateMediaDevices);
    };
  }, [sdk]);

  const toggleAudio = useCallback(async () => {
    if (!sdk) return;

    try {
      await sdk.toggleAudio();
      const stream = sdk.getLocalStream();
      if (stream) {
        const audioTrack = stream.getAudioTracks()[0];
        setAudioEnabled(audioTrack?.enabled ?? false);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [sdk]);

  const toggleVideo = useCallback(async () => {
    if (!sdk) return;

    try {
      await sdk.toggleVideo();
      const stream = sdk.getLocalStream();
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        setVideoEnabled(videoTrack?.enabled ?? false);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [sdk]);

  const toggleScreenShare = useCallback(async () => {
    if (!sdk) return;

    try {
      await sdk.toggleScreenShare();
    } catch (err) {
      setError(err as Error);
    }
  }, [sdk]);

  const switchCamera = useCallback(
    async (deviceId: string) => {
      if (!sdk) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
        });

        const newVideoTrack = stream.getVideoTracks()[0];
        const oldStream = sdk.getLocalStream();

        if (oldStream) {
          const oldVideoTrack = oldStream.getVideoTracks()[0];
          oldStream.removeTrack(oldVideoTrack);
          oldStream.addTrack(newVideoTrack);
          oldVideoTrack.stop();
        }

        setLocalStream(oldStream);
      } catch (err) {
        setError(err as Error);
      }
    },
    [sdk]
  );

  const switchMicrophone = useCallback(
    async (deviceId: string) => {
      if (!sdk) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });

        const newAudioTrack = stream.getAudioTracks()[0];
        const oldStream = sdk.getLocalStream();

        if (oldStream) {
          const oldAudioTrack = oldStream.getAudioTracks()[0];
          oldStream.removeTrack(oldAudioTrack);
          oldStream.addTrack(newAudioTrack);
          oldAudioTrack.stop();
        }

        setLocalStream(oldStream);
      } catch (err) {
        setError(err as Error);
      }
    },
    [sdk]
  );

  return {
    localStream,
    audioEnabled,
    videoEnabled,
    screenShareEnabled,
    devices,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    switchCamera,
    switchMicrophone,
    error,
  };
}
