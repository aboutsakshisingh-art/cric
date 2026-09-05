import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useMatchStore } from '../store/matchStore';
import Scoreboard from './Scoreboard';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const LiveOverlay = () => {
  const { proOverlay, setMatchState } = useMatchStore();
  const { showScore } = proOverlay;

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Overlay connected to backend:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Overlay disconnected from backend');
    });

    socket.on('matchStateUpdate', (updatedState) => {
      console.log('📡 Received match state update:', updatedState);
      setMatchState(updatedState);
    });

    socket.on('error', (error) => {
      console.error('⚠️ Socket error:', error);
    });

    return () => {
      socket.disconnect();
      console.log('🔌 Socket connection closed');
    };
  }, [setMatchState]);

  // Hide entire overlay if showScore is false
  if (!showScore) {
    return null;
  }

  return (
    <div className="live-overlay-container">
      <Scoreboard />
    </div>
  );
};

export default LiveOverlay;
