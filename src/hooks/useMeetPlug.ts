import { useState, useEffect, useCallback, useRef } from 'react';
import { MeetPlugSDK } from '../core/MeetPlugSDK';
import type { Room, Participant, ChatMessage, MeetPlugConfig, UseMeetPlugReturn } from '../types';

export function useMeetPlug(config?: MeetPlugConfig): UseMeetPlugReturn {
  const sdkRef = useRef<MeetPlugSDK | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Initialize SDK
  useEffect(() => {
    if (!sdkRef.current) {
      sdkRef.current = new MeetPlugSDK(config);
    }

    const sdk = sdkRef.current;

    // Set up event listeners
    sdk.on('room:joined', (joinedRoom) => {
      setRoom(joinedRoom);
      setLocalParticipant(sdk.getLocalParticipant());
      setIsConnected(true);
      setIsJoining(false);
    });

    sdk.on('room:left', () => {
      setRoom(null);
      setLocalParticipant(null);
      setParticipants([]);
      setIsConnected(false);
      setChatMessages([]);
    });

    sdk.on('room:error', (err) => {
      setError(err);
      setIsJoining(false);
    });

    sdk.on('participant:joined', (participant) => {
      setParticipants((prev) => [...prev, participant]);
    });

    sdk.on('participant:left', (participantId) => {
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    });

    sdk.on('participant:updated', (participant) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === participant.id ? participant : p))
      );
    });

    sdk.on('chat:message', (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      sdk.destroy();
      sdkRef.current = null;
    };
  }, [config]);

  const joinRoom = useCallback(async (roomId: string, participantName?: string) => {
    if (!sdkRef.current) return;

    setIsJoining(true);
    setError(null);

    try {
      await sdkRef.current.joinRoom(roomId, participantName);
    } catch (err) {
      setError(err as Error);
      setIsJoining(false);
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (!sdkRef.current) return;
    sdkRef.current.leaveRoom();
  }, []);

  const sendChatMessage = useCallback((message: string) => {
    if (!sdkRef.current) return;
    sdkRef.current.sendChatMessage(message);
  }, []);

  return {
    room,
    localParticipant,
    participants,
    isConnected,
    isJoining,
    error,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    chatMessages,
  };
}
