import styles from './styles.module.scss'
import {Dropdown, MenuProps, Select, Space} from "antd";
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {IFranchise, IFranchiseInfo} from "../../types/franchiseTypes.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import {useEffect} from "react";
import {useStateContext} from "../../contexts";
import {resetService} from "../../services/resetService.ts";
import {authApi} from "../../api/authApi.ts";
import userIcon from '../../assets/userIcon.svg'
import {DownOutlined} from '@ant-design/icons'
import {Spinner} from "../Shared/Spinner";

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
        refetchOnMount: false
    });

    const { data: franchiseInfo, isLoading: franchiseInfoLoading } = useQuery({
        queryKey: ['franchiseInfo'],
        queryFn: () =>
            axiosInstance
                .get<IFranchiseInfo[]>('partners/franchise-info/')
                .then((response) => response?.data),
        refetchOnMount: false
    });

    console.log(franchiseInfo, 'll')

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

    const franchiseData = franchiseInfo?.find(item => item)

    return (
        <div className={styles.container}>
            <div className={styles.container_info}>
                <div className={styles.container_info_logo}>
                    <div className={styles.container_info_logo_icon}>
                        Партнерский админ панель
                    </div>
                    {/*<div className={styles.container_info_logo_lang}>*/}
                    {/*    RU*/}
                    {/*</div>*/}
                </div>
                <div className={styles.container_info_user}>
                    {franchiseInfoLoading ? <Spinner text/> : franchiseData?.short_description}
                </div>
            </div>
            <div className={styles.container_action}>
                <div>
                    <Select
                        onChange={(value: number) => {
                            dispatch({
                                type: 'SET_ADDRESS_ID',
                                payload: value as number
                            })
                        }}
                        style={{width: 'max-content', color: 'red'}}
                        options={options}
                        variant="borderless"
                        value={addressId}
                        showSearch
                        loading={isLoading}
                        popupMatchSelectWidth={false}
                        labelRender={(e) => <div
                            style={{
                                color: '#fff',
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: "pointer"
                        }}
                        >{e?.label}
                        </div>
                    }
                        suffixIcon={isLoading ? <Spinner text/> : <DownOutlined style={{color: '#fff'}} />}

                    />
                </div>
                <div className={styles.container_action_logout}>
                    <img src={userIcon} alt={''} width={25} height={25}/>
                    <div className={styles.container_action_logout_partner}>
                        <Dropdown menu={{ items }} placement={'bottomRight'}>
                            <a onClick={(e) => {
                                e.preventDefault()
                            }}>
                                <Space style={{marginRight: 20, textTransform: "uppercase", cursor: 'pointer'}}>
                                    {franchiseData?.title}
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
