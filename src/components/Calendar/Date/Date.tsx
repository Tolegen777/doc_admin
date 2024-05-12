import styles from './styles.module.scss'

type Props = {
  weekDay: string,
  month: string,
  day: number
}
const Date = ({weekDay, day, month}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <div className={styles.container_content_text}>{weekDay}</div>
                <div className={styles.container_content_day}>{day}</div>
                <div className={styles.container_content_text}>{month}</div>
            </div>
        </div>
    );
};

export default Date;
