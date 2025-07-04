import socketio from 'socket.io-client';
import { BE_SOCKET_URL } from '../../config/beSocketConfig.js';

// Use both polling and websocket transports to improve connection stability
const socket = socketio(BE_SOCKET_URL, {
  transports: ['polling', 'websocket'],
});

export default socket;
