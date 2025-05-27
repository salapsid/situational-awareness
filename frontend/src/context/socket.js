import React from 'react'
import socketio from "socket.io-client";
import { BE_SOCKET_URL } from "../../config/beSocketConfig.js";

export const BE_SOCKET = socketio.connect(BE_SOCKET_URL,{transports: ["websocket"]});
export const BE_SOCKET_CONTEXT = React.createContext(BE_SOCKET);