import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Календарь',
        key: '/calendar',
    },
    {
        label: 'Записи',
        key: '/appointments',
    },
    {
        label: 'Ежедневная сверка',
        key: '/daily_reconciliation',
    },
    {
        label: 'Сверка',
        key: '/reconciliation',
    },
    {
        label: 'Отзывы',
        key: '/reviews',
    },
    {
        label: 'Врачи',
        key: '/doctors',
    },
    {
        label: 'Счет на оплату',
        key: '/payment',
    },
];

const NavigationMenu: React.FC = () => {
    const [current, setCurrent] = useState('mail');
    const navigate = useNavigate()

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
        navigate(e.key)
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default NavigationMenu;
