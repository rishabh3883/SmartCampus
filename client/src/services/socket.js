import { io } from 'socket.io-client';
import { SERVER_URL } from '../config';

// Check if running on Vercel where socket server is not hosted on the same origin
const isVercelOrigin = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && !import.meta.env.VITE_SOCKET_URL;

const socket = io(import.meta.env.VITE_SOCKET_URL || SERVER_URL, {
    autoConnect: !isVercelOrigin, // Prevent 404 polling loops on serverless
    reconnection: !isVercelOrigin,
    reconnectionAttempts: 2,
    timeout: 3000,
    transports: ['websocket', 'polling']
});

export default socket;
