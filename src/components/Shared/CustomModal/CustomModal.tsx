import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.scss";
import { Spinner } from "../Spinner";

type CustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
    title: string;
    isLoading: boolean;
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, onConfirm, children, title, isLoading }) => {
    const handleEscape = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        } else {
            document.removeEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeader_title}>
                        {title}
                    </div>
                    <button className={styles.modalClose} onClick={onClose}>
                        &times;
                    </button>
                </div>
                {children}
                <div className={styles.modalFooter}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                    <button
                        className={styles.confirmButton}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner text /> : 'Подтвердить'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CustomModal;
