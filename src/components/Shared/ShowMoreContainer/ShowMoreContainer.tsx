import styles from './styles.module.scss';
import {Button} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import {ReactNode, useState} from "react";

type Props = {
    children: ReactNode,
    showButton?: boolean
}

const ShowMoreContainer = ({
                               children,
    showButton = true
                           }: Props) => {

    const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);

    return (
        <div className={styles.timeSlotsContainer}>
            <div className={`${styles.timeSlots} ${showAllTimeSlots ? styles.showAll : ''}`}>
                {children}
            </div>
            <div className={styles.action}>
                {showButton && <Button
                    type={'text'}
                    icon={showAllTimeSlots ? <UpOutlined/> : <DownOutlined/>}
                    onClick={() => setShowAllTimeSlots(prevState => !prevState)}
                    style={{color: '#459BFF'}}
                >
                    {showAllTimeSlots ? 'Скрыть' : 'Показать еще'}
                </Button>}
            </div>
        </div>
    );
};

export default ShowMoreContainer;
