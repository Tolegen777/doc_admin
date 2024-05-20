import styles from './styles.module.scss'
import {Avatar, Tooltip, Typography} from "antd";
import {UserOutlined} from '@ant-design/icons';
import calendarIcon from '../../../assets/calendarIcon.svg'

const {Title} = Typography;

type Props = {
    doctor: string,
    count?: number
    isEmpty?: boolean,
}
const DoctorTitle = ({doctor, isEmpty = false, count}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.container_count}>{count}</div>
            <div className={styles.container_info}>
                {!isEmpty && <Avatar size="small" icon={<UserOutlined/>}/>}
                <Tooltip title={doctor}>
                    <Title
                        style={{
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{doctor}</Title>
                </Tooltip>
            </div>
            <div className={styles.container_calendar}>
                {!isEmpty && <img src={calendarIcon}
                                  width={20}
                                  height={20}
                                  alt=""
                    style={{
                        fontSize: '17px',
                        fontWeight: 800
                    }}/>}
            </div>

        </div>
    );
};

export default DoctorTitle;
