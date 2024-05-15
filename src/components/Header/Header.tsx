import styles from './styles.module.scss'
import {Avatar, Dropdown, MenuProps, Select, Space} from "antd";
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {IFranchise} from "../../types/franchiseTypes.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import {useEffect} from "react";
import {useStateContext} from "../../contexts";
import {resetService} from "../../services/resetService.ts";
import {authApi} from "../../api/authApi.ts";

const Header = () => {

    const {state, dispatch} = useStateContext()

    const {addressId} = state

    const {
        mutate: onLogout,
    } = useMutation({
        mutationKey: ['signout'],
        mutationFn: authApi.signOutUser,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['franchiseBranches'],
        queryFn: () =>
            axiosInstance
                .get<IFranchise[]>('partners/franchise-branches/')
                .then((response) => response?.data),
    });

    const items: MenuProps['items'] = [
        {
            key: '4',
            danger: true,
            label: 'Выйти',
            onClick: () => {
                resetService()
                onLogout()
            }
        },
    ];

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
                        style={{width: 'max-content', color: '#fff'}}
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
                        <Dropdown menu={{ items }} placement={'bottomRight'}>
                            <a onClick={(e) => {
                                e.preventDefault()
                            }}>
                                <Space style={{marginRight: 20}}>
                                    Эмирмед
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
