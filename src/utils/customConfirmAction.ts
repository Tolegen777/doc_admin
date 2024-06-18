import {Modal} from 'antd';

type Props = {
    message: string,
    action: () => void,
    okBtnText?: string,
    alignTop?: boolean,
    hideCancelButton?: boolean
}

export const customConfirmAction = ({
                                        message,
                                        action,
                                        okBtnText = 'Ok',
                                        alignTop = false,
                                        hideCancelButton = false
                                    }: Props) => {
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
        style: alignTop ? {top: 0} : {},
        cancelButtonProps: hideCancelButton ? {style: {display: 'none'}} : {},
    });
};
