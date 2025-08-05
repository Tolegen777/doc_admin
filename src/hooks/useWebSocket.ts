import { useEffect, useState, useCallback } from 'react';
import { websocketService, type NotificationData } from '../services/websocketService.tsx';
import { tokenService } from '../services/tokenService';

export const useWebSocket = () => {
    const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
    const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);

    // Функция для подключения
    const connect = useCallback(() => {
        websocketService.connect();
    }, []);

    // Функция для отключения
    const disconnect = useCallback(() => {
        websocketService.disconnect();
    }, []);

    // Эффект для отслеживания статуса подключения
    useEffect(() => {
        const checkStatus = () => {
            setConnectionStatus(websocketService.getConnectionStatus());
        };

        const interval = setInterval(checkStatus, 1000);
        checkStatus(); // Проверяем сразу

        return () => clearInterval(interval);
    }, []);

    // Эффект для подписки на уведомления
    useEffect(() => {
        const unsubscribe = websocketService.subscribe((data: NotificationData) => {
            setLastNotification(data);
        });

        return unsubscribe;
    }, []);

    // Автоматическое подключение при наличии токена
    useEffect(() => {
        const token = tokenService.getLocalAccessToken();
        if (token && connectionStatus === 'disconnected') {
            connect();
        }
    }, [connect, connectionStatus]);

    return {
        connectionStatus,
        lastNotification,
        connect,
        disconnect,
        isConnected: connectionStatus === 'connected',
        isConnecting: connectionStatus === 'connecting',
    };
};
