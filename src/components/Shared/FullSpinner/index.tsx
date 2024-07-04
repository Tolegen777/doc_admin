import styles from './styles.module.scss';
import {Spin} from "antd";

export const FullSpinner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.container_content_wrapper}>
                <Spin size={'large'}/>
            </div>
        </div>
    );
};
