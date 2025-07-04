import socketio from 'socket.io-client';
import { BE_SOCKET_URL } from '../../config/beSocketConfig.js';

// Use both polling and websocket transports to improve connection stability
const socket = socketio(BE_SOCKET_URL, {
  transports: ['polling', 'websocket'],
  // Match the server's ping settings so the connection isn't dropped
  pingTimeout: 60000,
  pingInterval: 25000,
});

export default socket;
