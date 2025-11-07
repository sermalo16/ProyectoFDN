import React from "react";
import { Layout, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logoFuno from "../../../assets/grupofuno.jpg";

const { Header } = Layout;

export default function AdminHeader({ collapsed }) {
  const navigate = useNavigate();

  return (
    <Header className={`admin-header ${collapsed ? "collapsed" : "expanded"}`}>
      <div className="header-left">
        <img src={logoFuno} alt="Grupo Funo" className="logo-img" />
      </div>

      <div className="header-right">
        <Tooltip title="Buscar" placement="bottom">
          <SearchOutlined className="header-icon" />
        </Tooltip>

        <Tooltip title="Nueva Solicitud" placement="bottom">
          <PlusCircleOutlined
            className="header-icon"
            onClick={() => navigate("/admin/tikets")}
          />
        </Tooltip>

        <Tooltip title="Configuración" placement="bottom">
          <SettingOutlined
            className="header-icon"
            onClick={() => navigate("/admin/configuration")}
          />
        </Tooltip>

        <Tooltip title="Perfil" placement="bottom">
          <UserOutlined
            className="header-icon"
            onClick={() => navigate("/admin/profile")}
          />
        </Tooltip>
      </div>
    </Header>
  );
}
