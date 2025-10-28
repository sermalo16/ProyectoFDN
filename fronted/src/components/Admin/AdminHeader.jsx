import React from "react";
import { Layout } from "antd";
import { SearchOutlined, PlusCircleOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logoFuno from "../../assets/grupofuno.jpg";


const { Header } = Layout;

export default function AdminHeader({ collapsed }) {
  const navigate = useNavigate();
  const siderWidth = collapsed ? 80 : 200;

  return (
    <Header
      className="admin-header"
      style={{
        left: siderWidth,
        width: `calc(100% - ${siderWidth}px)`,
      }}
    >
      <div className="header-left">
        <img src={logoFuno} alt="Logo" className="logo-img" />
        <span className="company-name">Grupo Funo</span>
      </div>
      <div className="header-right">
        <SearchOutlined className="header-icon" />
        <PlusCircleOutlined className="header-icon" onClick={() => navigate("/admin/tikets")} />
        <SettingOutlined className="header-icon" onClick={() => navigate("/admin/configuration")} />
        <UserOutlined className="header-icon" onClick={() => navigate("/admin/profile")} />
      </div>
    </Header>
  );
}
