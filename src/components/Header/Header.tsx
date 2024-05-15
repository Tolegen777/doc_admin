import styles from './styles.module.scss'
import {Avatar, Select} from "antd";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {IFranchise} from "../../types/franchiseTypes.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import {useEffect} from "react";
import {useStateContext} from "../../contexts";

const Header = () => {

    const {state, dispatch} = useStateContext()

    const {addressId} = state

    // const [activeAddress, setActiveAddress] = useState<number | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['franchiseBranches'],
        queryFn: () =>
            axiosInstance
                .get<IFranchise[]>('partners/franchise-branches/')
                .then((response) => response?.data),
    });

    useEffect(() => {
        if (data && !addressId) {
            const defaultId = data?.find(item => item)?.id ?? null
            dispatch({
                type: 'SET_ADDRESS_ID',
                payload: defaultId as number
            })
        }
    }, [data])

    const options =
        selectOptionsParser<IFranchise>(data ?? [], 'title', 'id')

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
                    <Select
                        onChange={(value: number) => {
                            dispatch({
                                type: 'SET_ADDRESS_ID',
                                payload: value as number
                            })
                        }}
                        style={{width: 'max-content'}}
                        options={options}
                        variant="borderless"
                        value={addressId}
                        showSearch
                        loading={isLoading}
                        popupMatchSelectWidth={false}
                    />
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
