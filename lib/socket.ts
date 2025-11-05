import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

export const initializeSocket = (roomId: string): Socket => {
  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  console.log('🔌 Connecting to backend:', backendUrl);
  
  socket = io(backendUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    timeout: 20000,
    forceNew: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
    // Join room immediately after connection
    if (roomId) {
      console.log('🔗 Joining room:', roomId);
      socket?.emit('join-room', { roomId });
    }
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
    console.error('Backend URL:', backendUrl);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server disconnected the socket, reconnect manually
      socket?.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('room-joined', (data) => {
    console.log('✅ Room joined successfully:', data);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

