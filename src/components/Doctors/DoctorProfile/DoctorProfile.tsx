import {Avatar, Image, Typography} from 'antd';
import styles from './styles.module.scss'
import {UserOutlined} from "@ant-design/icons";

type Props = {
    imgSrc: string,
    title: string,
    subTitle?: string
}

export const DoctorProfile = ({imgSrc, subTitle, title}: Props) => {

    return <div className={styles.container}>
        <div className={styles.container_img}>
            {imgSrc?.length ? <Image src={imgSrc} width={20} height={20}/> :
                <Avatar size={32} icon={<UserOutlined/>}/>}
        </div>
        <div className={styles.container_info}>
            <Typography.Title
                style={{fontSize: 15}}
                className={styles.container_info_title}
            >
                {title}
            </Typography.Title>
            {subTitle?.length && <div className={styles.container_info_subTitle}>
                {subTitle}
            </div>}
        </div>
    </div>
};
