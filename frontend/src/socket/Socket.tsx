// socketService.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = (token: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:7000', {
      query: { token },
      withCredentials: true,
    });

    console.log('Running');
    socket.on('connect', () => {
      console.log('Connected to socket.io server', socket!.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });
  } else {
    console.log('Socket connection already exists');
  }
  return socket;
};

export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    throw new Error('Socket connection has not been initialized. Please call createConnection or initiateSocketConnection first.');
  }
  return socket;
};
