import { useState, useEffect, useCallback } from 'react';
import { MeetPlugSDK } from '../core/MeetPlugSDK';
import type { Room, Participant, UseRoomReturn } from '../types';

export function useRoom(sdk: MeetPlugSDK | null): UseRoomReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!sdk) return;

    const updateRoom = () => {
      const currentRoom = sdk.getRoom();
      setRoom(currentRoom);

      if (currentRoom) {
        const localParticipant = sdk.getLocalParticipant();
        setIsHost(localParticipant?.id === currentRoom.hostId);
        setParticipants(sdk.getAllParticipants());
      }
    };

    updateRoom();

    sdk.on('room:joined', updateRoom);
    sdk.on('participant:joined', updateRoom);
    sdk.on('participant:left', updateRoom);
    sdk.on('participant:updated', updateRoom);

    return () => {
      sdk.off('room:joined', updateRoom);
      sdk.off('participant:joined', updateRoom);
      sdk.off('participant:left', updateRoom);
      sdk.off('participant:updated', updateRoom);
    };
  }, [sdk]);

  const kickParticipant = useCallback(
    (participantId: string) => {
      if (!sdk || !isHost) {
        console.warn('Only the host can kick participants');
        return;
      }

      // TODO: Implement kick functionality
      console.log('Kicking participant:', participantId);
    },
    [sdk, isHost]
  );

  const updateRoomSettings = useCallback(
    (settings: Partial<Room>) => {
      if (!sdk || !isHost || !room) {
        console.warn('Only the host can update room settings');
        return;
      }

      // TODO: Implement room settings update
      console.log('Updating room settings:', settings);
    },
    [sdk, isHost, room]
  );

  return {
    room,
    participants,
    isHost,
    kickParticipant,
    updateRoomSettings,
  };
}
