import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import {useNavigate, useLocation} from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Календарь",
    key: "/calendar",
  },
  {
    label: "Записи",
    key: "/visits",
  },
  {
    label: "Ежедневная сверка",
    key: "/daily_summary",
  },
  {
    label: "Сверка",
    key: "/monthly_summary",
  },
  {
    label: "Отзывы",
    key: "/reviews",
  },
  {
    label: "Врачи",
    key: "/all-doctors",
  },
  // {
  //     label: 'Франшизы',
  //     key: '/franchises',
  // },
  // {
  //     label: 'Удобства франшизы',
  //     key: '/amenities',
  // },
  {
    label: "Счет на оплату",
    key: "/payment",
  },
];

const NavigationMenu: React.FC = () => {
  const location = useLocation()
  const [current, setCurrent] = useState(location.pathname.split("/")[1] ? `/${location.pathname.split("/")[1]}` : '/calendar');
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default NavigationMenu;
