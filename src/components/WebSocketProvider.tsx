import React, { useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { tokenService } from '../services/tokenService';

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const { connect, disconnect, connectionStatus } = useWebSocket();

    useEffect(() => {
        // Подключаемся при монтировании, если есть токен
        const token = tokenService.getLocalAccessToken();
        if (token) {
            connect();
        }

        // Отключаемся при размонтировании
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Показываем статус подключения в консоли (можно убрать в продакшене)
    useEffect(() => {
        console.log('WebSocket status:', connectionStatus);
    }, [connectionStatus]);

    return <>{children}</>;
};
