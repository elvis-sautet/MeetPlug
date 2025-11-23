import React, { useState } from 'react';
import { MeetPlugRoom } from 'meetplug';
import 'meetplug/dist/style.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [inMeeting, setInMeeting] = useState(false);

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && participantName) {
      setInMeeting(true);
    }
  };

  if (inMeeting) {
    return (
      <MeetPlugRoom
        roomId={roomId}
        participantName={participantName}
        onJoin={(room) => {
          console.log('Successfully joined room:', room);
        }}
        onLeave={() => {
          console.log('Left the meeting');
          setInMeeting(false);
        }}
        onError={(error) => {
          console.error('Meeting error:', error);
        }}
        theme="dark"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MeetPlug</h1>
          <p className="text-gray-400">Join or create a meeting room</p>
        </div>

        <form onSubmit={handleJoinMeeting} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-300 mb-2">
              Room ID
            </label>
            <input
              id="room"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID or create new"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Join Meeting
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Or generate a random room:
          </p>
          <button
            onClick={() => {
              const randomRoom = `room-${Math.random().toString(36).substr(2, 9)}`;
              setRoomId(randomRoom);
            }}
            className="mt-2 w-full py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Generate Room ID
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
