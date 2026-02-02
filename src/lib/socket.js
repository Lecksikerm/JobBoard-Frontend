import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://job-board-platform-3s4b.onrender.com';

let socket = null;

export const initializeSocket = (userId) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        // Join user's personal room for notifications
        if (userId) {
            socket.emit('join_room', userId);
        }
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket manually disconnected');
    }
};

export const subscribeToNotifications = (callback) => {
    if (!socket) return;

    socket.on('new_notification', (data) => {
        console.log('New notification received:', data);
        callback(data);
    });
};

export const unsubscribeFromNotifications = () => {
    if (!socket) return;
    socket.off('new_notification');
};