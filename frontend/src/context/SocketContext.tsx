// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Socket } from 'socket.io-client';
import { initiateSocketConnection } from '../socket/Socket';

interface SocketContextProps {
  socket: Socket | null;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = (token: string) => {
    const socketInstance = initiateSocketConnection(token);
    setSocket(socketInstance);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    Cookies.remove('user');
  };

  useEffect(() => {
    const token = Cookies.get('user');
    if (token) {
      connectSocket(token);
    }
    else{
      disconnectSocket();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
