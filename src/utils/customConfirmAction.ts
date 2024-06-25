import {Modal} from 'antd';

type Props = {
    message: string,
    action: () => void,
    okBtnText?: string,
    alignTop?: boolean,
    hideCancelButton?: boolean,
    isCentered?: boolean
}

export const customConfirmAction = ({
                                        message,
                                        action,
                                        okBtnText = 'Ok',
                                        alignTop = false,
                                        hideCancelButton = false,
                                        isCentered = false
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
        centered: isCentered
    });
};
