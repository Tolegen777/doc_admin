import styles from './styles.module.scss';
import {Spinner} from "../Spinner";

export default function InfiniteScrollLoader() {
    return (
        <div className={styles.container}>
            <Spinner/>
        </div>
    );
}
