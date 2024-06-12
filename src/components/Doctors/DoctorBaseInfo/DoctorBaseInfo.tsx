import styles from './styles.module.scss'

type Props = {}
const DoctorBaseInfo = ({}: Props) => {

    return (
        <div className={styles.container}>
             <div className={styles.container_avatar}>
                 <img src={''} alt=''/>
             </div>
            <div className={styles.container_info}>

            </div>
        </div>
    );
};

export default DoctorBaseInfo;
