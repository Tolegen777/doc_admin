// services/websocketService.ts
import { notification } from 'antd';
import { tokenService } from './tokenService';

export interface NotificationData {
    first_name: string;
    last_name: string;
    phone_number: string;
    doctor: string;
    clinic: string;
    date: string;
    time: string;
    visit_id: number;
}

type NotificationCallback = (data: NotificationData) => void;

class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // 1 секунда
    private callbacks: NotificationCallback[] = [];
    private isConnecting = false;

    private getWebSocketUrl(): string {
        const token = tokenService.getLocalAccessToken();
        return `wss://backend.docfinder.kz/ws/notifications/?token=${token}`;
    }

    public connect(): void {
        const token = tokenService.getLocalAccessToken();

        if (!token) {
            console.warn('No access token found, WebSocket connection skipped');
            return;
        }

        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            this.ws = new WebSocket(this.getWebSocketUrl());

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
            this.ws.onerror = this.handleError.bind(this);

        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.isConnecting = false;
        }
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close(1000, 'Manual disconnect');
            this.ws = null;
        }
        this.reconnectAttempts = 0;
        this.isConnecting = false;
    }

    public subscribe(callback: NotificationCallback): () => void {
        this.callbacks.push(callback);

        // Возвращаем функцию для отписки
        return () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        };
    }

    private handleOpen(): void {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data: NotificationData = JSON.parse(event.data);

            // Показываем уведомление
            this.showNotification(data);

            // Вызываем все подписанные колбэки
            this.callbacks.forEach(callback => callback(data));

        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    private handleClose(event: CloseEvent): void {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.ws = null;
        this.isConnecting = false;

        // Переподключаемся, если это не ручное отключение
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
        }
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
    }

    private attemptReconnect(): void {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

        setTimeout(() => {
            if (tokenService.getLocalAccessToken()) {
                this.connect();
            }
        }, delay);
    }

    private showNotification(data: NotificationData): void {
        console.log(data, 'Notification data received');

        // Форматируем дату в более читаемый вид
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        // Создаем кликабельное уведомление с React элементом
        const NotificationContent = (
            <div
                style={{
            cursor: 'pointer',
                color: 'white',
                whiteSpace: 'pre-line',
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: 500
        }}
        onClick={() => {
            // Переходим на страницу детальной записи
            window.location.href = `/visits/${data.visit_id}`;
            // Закрываем уведомление
            notification.destroy();
        }}
    >
    📅 Новая запись создана
        {'\n'}Детали записи:
        {'\n'}• Клиника: {data.clinic}
        {'\n'}• Дата: {formatDate(data.date)}
        {'\n'}• Время: {data.time}
        {'\n'}
        {'\n'}👆 Нажмите, чтобы просмотреть детали
        </div>
    );

        notification.open({
            message: null,
            description: NotificationContent,
            duration: 8000, // Увеличиваем время показа до 8 секунд
            style: {
                backgroundColor: '#5194C1',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 6px 16px rgba(81, 148, 193, 0.4)',
            },
            className: 'custom-appointment-notification',
            onClick: () => {
                // Дополнительный обработчик клика на само уведомление
                window.location.href = `/visits/${data.visit_id}`;
                notification.destroy();
            }
        });
    }

    public getConnectionStatus(): string {
        if (!this.ws) return 'disconnected';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
                return 'closing';
            case WebSocket.CLOSED:
                return 'disconnected';
            default:
                return 'unknown';
        }
    }
}

// Создаем единственный экземпляр сервиса
export const websocketService = new WebSocketService();
