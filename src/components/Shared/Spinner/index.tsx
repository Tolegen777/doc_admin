import styles from './styles.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
export const Spinner = ({ text = false }: { text?: boolean }) => {
    if (text)
        return (
            <Spin
                indicator={
                    <LoadingOutlined className={styles.text_loader} spin />
                }
            />
        );
    return <span className={styles.loader}></span>;
};
