import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;

  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocket = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connectSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
