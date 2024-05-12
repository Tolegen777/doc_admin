import styles from './styles.module.scss'
import CalendarContent from "../../components/Calendar/CalendarContent/CalendarContent.tsx";
import Filters from "../../components/Calendar/Filters/Filters.tsx";

const CalendarPage = () => {
    return (
        <div className={styles.container}>
            <Filters/>
            <CalendarContent/>
        </div>
    );
};

export default CalendarPage;
