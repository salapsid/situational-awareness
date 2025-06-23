import React from 'react';
import socket from '../api/socket.js';

export const BE_SOCKET = socket;
export const BE_SOCKET_CONTEXT = React.createContext(BE_SOCKET);

