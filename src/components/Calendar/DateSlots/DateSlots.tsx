import styles from './styles.module.scss'
import Date from "../Date/Date.tsx";
import {IDate} from "../../../types/common.ts";
import {memo} from "react";

type Props = {
    dates: IDate[]
}
const DateSlots = memo(({dates}: Props) => {
    return (
        <div className={styles.container}>
            {dates?.map(item => <Date key={item?.date} weekDay={item.weekday} day={item.day} month={item.month}/>)}
        </div>
    );
});

export default DateSlots;
