import styles from './styles.module.scss';
import {Spinner} from "../Spinner";
export const FullSpinner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.container_content_wrapper}>
                <Spinner />
            </div>
        </div>
    );
};
