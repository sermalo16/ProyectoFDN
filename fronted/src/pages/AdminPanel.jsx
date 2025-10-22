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

// ...imports
const { Header, Sider, Content } = Layout;

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname.split("/")[2] || "tikets";
  const handleMenuClick = ({ key }) => navigate(`/admin/${key}`);

  // ancho actual del sider según colapsado
  const siderWidth = collapsed ? 80 : 200;

  return (
    <Layout className="admin-layout">
      <Sider
        width={200}
        collapsedWidth={80}
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
          items={[
            { key: "tikets", icon: <FileTextOutlined />, label: "Solicitudes" },
            { key: "manuals", icon: <CheckCircleOutlined />, label: "Soluciones" },
            { key: "asigment", icon: <SwapOutlined />, label: "Asignaciones" },
            { key: "configuration", icon: <SettingOutlined />, label: "Configuración" },
          ]}
        />
      </Sider>

      {/* Este Layout se desplaza a la derecha el ancho del Sider */}
      <Layout>
        {/* Header fijo, pero su 'left' se ajusta al ancho del Sider */}
        <Header className="admin-header" style={{ left: collapsed ? 80 : 200, width: `calc(100% - ${collapsed ? 80 : 200}px)` }}>
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

        {/* El contenido NO tiene scroll interno; se usa el del navegador */}
        <Content className="admin-content" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

