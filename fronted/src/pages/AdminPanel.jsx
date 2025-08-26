import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/AdminPanel.scss";
import logoFuno from "../assets/grupofuno.jpg";
import useAuthCheck from "../hooks/useAuthCheck";

const { Header, Sider, Content } = Layout;

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname.split("/")[2] || "tikets";

  const handleMenuClick = ({ key }) => {
    navigate(`/admin/${key}`);
  };

  //useAuthCheck(); // 👈 Revisa el token al entrar

  return (
    <Layout className="admin-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="admin-sider"
      >
        <div className="menu-toggle-icon">
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[currentPath]}
        >
          <Menu.Item key="tikets" icon={<FileTextOutlined />}>
            Solicitudes
          </Menu.Item>
          <Menu.Item key="manuals" icon={<CheckCircleOutlined />}>
            Soluciones
          </Menu.Item>
          <Menu.Item key="asigment" icon={<SwapOutlined />}>
            Asignaciones
          </Menu.Item>
          <Menu.Item key="configuration" icon={<SettingOutlined />}>
            Configuración
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="admin-header">
          <div className="header-left">
            <img src={logoFuno} alt="Logo" className="logo-img" />
            <span className="company-name">Grupo Funo</span>
          </div>
          <div className="header-right">
            <SearchOutlined className="header-icon" />

            <PlusCircleOutlined
              className="header-icon"
              onClick={() => navigate("/admin/tikets")}
            />

            <SettingOutlined
              className="header-icon"
              onClick={() => navigate("/admin/configuration")}
            />

            <UserOutlined
              className="header-icon"
              onClick={() => navigate("/admin/profile")}
            />
          </div>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
