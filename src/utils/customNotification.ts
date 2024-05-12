import { notification } from 'antd';

type NotificationProps = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

export const customNotification = ({ type, message }: NotificationProps) => {
  notification[type]({
    message,
  });
};
