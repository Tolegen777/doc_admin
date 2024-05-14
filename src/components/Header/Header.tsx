import styles from './styles.module.scss'
import {Avatar} from "antd";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {IFranchise} from "../../types/franchiseTypes.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";

const Header = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['franchiseBranches'],
        queryFn: () =>
            axiosInstance
                .get<IFranchise[]>('partners/franchise-branches/')
                .then((response) => response?.data),
    });

    const options = selectOptionsParser<IFranchise>(data ?? [], 'title', 'id')

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
