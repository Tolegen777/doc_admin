import styles from './styles.module.scss'
import {Avatar} from "antd";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.container_info}>
                <div className={styles.container_info_logo}>
                    <div className={styles.container_info_logo_icon}>
                        DOQ
                    </div>
                    <div className={styles.container_info_logo_lang}>
                        RU
                    </div>
                </div>
                <div className={styles.container_info_user}>
                    Ваш менеджер: Манарбек +77777777777
                </div>
            </div>
            <div className={styles.container_action}>
                <div className={styles.container_action_address}>

                </div>
                <div className={styles.container_action_logout}>
                    <Avatar/>
                    <div className={styles.container_action_logout_partner}>
                        Эмирмед
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
