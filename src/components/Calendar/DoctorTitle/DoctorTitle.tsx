import styles from './styles.module.scss'
import {Avatar, Typography} from "antd";
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

type Props = {
  doctor: string,
    count?: number
    isEmpty?: boolean,
}
const DoctorTitle = ({doctor, isEmpty = false, count}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <div className={styles.container_content_count}>
                    {count}
                </div>
                <div className={styles.container_content_info}>
                    {!isEmpty && <Avatar size="small" icon={<UserOutlined/>}/>}
                    <Title style={{fontSize: 14}}>{doctor}</Title>
                    {!isEmpty && <CalendarOutlined/>}
                </div>
            </div>
        </div>
    );
};

export default DoctorTitle;
