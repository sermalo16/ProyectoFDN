import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";


const { Sider } = Layout;

export default function AdminSider({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[2] || "tikets";

  const handleMenuClick = ({ key }) => navigate(`/admin/${key}`);

  return (
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
  );
}
