import socketio from 'socket.io-client';
import { BE_SOCKET_URL } from '../../config/beSocketConfig.js';

const socket = socketio.connect(BE_SOCKET_URL, { transports: ['websocket'] });

export default socket;
