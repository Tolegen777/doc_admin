import { Modal } from 'antd';

export const customConfirmAction = (
  message: string,
  action: () => void,
  okBtnText = 'Ok',
  alignTop = false,
  hideCancelButton = false
) => {
  Modal.confirm({
    title: 'Внимание',
    content: message,
    onOk() {
      action();
      Modal.destroyAll();
    },
    onCancel() {
      Modal.destroyAll();
    },
    okText: okBtnText,
    cancelText: 'Отмена',
    style: alignTop ? { top: 0 } : {},
    cancelButtonProps: hideCancelButton ? { style: { display: 'none' } } : {},
  });
};
