// src/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  // If socket exists and is connected, just return it
  if (socket && socket.connected) {
    return socket;
  }

  // If socket exists but not connected, update auth and reconnect
  if (socket && !socket.connected) {
    // update auth and reconnect
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  // Create a new singleton socket
  socket = io(import.meta.env.VITE_API_URL ?? 'http://localhost:8000', {
    auth: { token },
    transports: ['websocket'],
    path: '/socket.io',
    reconnectionAttempts: 3,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('⚠️ Socket connection error:', err?.message ?? err);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🧹 Socket connection closed');
  }
};
