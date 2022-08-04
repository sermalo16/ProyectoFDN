import React from 'react';
import { Button } from "antd";
import Smorel  from "../../assets/img/png/logo-white.png";
import { MenuUnfoldOutlined, PoweroffOutlined ,MenuFoldOutlined} from "@ant-design/icons";
import { logout } from "../../api/auth";



import "./MenuTop.scss";

export default function MenuTop(props) {
    const { menuCollapsed, setMenuCollapsed} = props;

    const logoutUser = () => {
        logout();
        window.location.reload();
    };
  return (
    <div className="menu-top">
        <div className="menu-top-left">
            <img className="menu-top-left-logo" src={Smorel} alt="Sergio Morel Lopez" />
            <Button type="link" onClick={() => setMenuCollapsed(!menuCollapsed)}>
                {menuCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined />}
            </Button>
        </div>

        <div className="menu-top-right">
            <Button type="link" onClick={logoutUser}>
                <PoweroffOutlined />
            </Button>
        </div>
    </div>
  )
}
