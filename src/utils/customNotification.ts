import { notification } from 'antd';

type NotificationProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
};

export const customNotification = ({ type, message, duration = 2000 }: NotificationProps) => {
  if (type === 'info') {
    notification.open({
      message: null,
      description: message,
    duration,
        style: {
      backgroundColor: '#5194C1',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(81, 148, 193, 0.3)',
    },
    className: 'custom-appointment-notification'
  });
  } else {
    notification[type]({
      message,
      duration
    });
  }
};
