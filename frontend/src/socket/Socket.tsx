import {io,Socket} from 'socket.io-client';

let socket:Socket;
export const createConnection =()=>{
  socket = io('http://localhost:7000', {
    withCredentials: true,
  });
  return socket;
}

export const initiateSocketConnection = (token) => {
  socket = io('http://localhost:7000', {
    query: { token },
    withCredentials: true,
  });
  console.log("running");
  socket.on('connect', () => {
    console.log('Connected to socket.io server',socket.id);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from socket.io server');
  });
};

export const getSocket = async() => {
  if (!socket) {
    await new Promise<void>((resolve) => {
      // Wait for the socket to be initialized
      socket.on('connect', () => {
        resolve();
      });
    });
  }
  return socket;
};