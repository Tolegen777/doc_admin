import styles from './styles.module.scss'
import {TextButton} from "../../../Shared/Buttons/TextButton";

type Props = {
}
export const SlotEditBlockHeader = ({}: Props) => {
    return (
            <div className={styles.container}>
                <div className={styles.container_title}>
                    <div>
                        Повторить предыдущий:
                    </div>
                    <div className={styles.container_title_link}>
                        день
                    </div>
                </div>
                <div className={styles.container_actions}>
                    <TextButton text={'Выделить все'} action={() => {
                    }}/>
                    /
                    <TextButton text={'Отменить все'} action={() => {
                    }}/>
                </div>
            </div>
    );
};
