import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.scss";

type CustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, onConfirm, children }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>
                    &times;
                </button>
                {children}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>Отмена</button>
                    <button className={styles.confirmButton} onClick={onConfirm}>Подтвердить</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CustomModal;
