import React from "react";
import { Layout, Menu, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

export default function AdminSider({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname.split("/")[2] || "tikets";

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout(); // Usa la función del contexto
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div className={`admin-sider ${collapsed ? "collapsed" : "expanded"}`}>
      {/* Botón superior para expandir/contraer */}
      <div className="sider-footer" onClick={() => setCollapsed(!collapsed)}>
        <MenuUnfoldOutlined
          className={`collapse-btn ${collapsed ? "rotated" : ""}`}
        />
      </div>

      {/* Contenedor del menú */}
      <div className="sider-menu-container">
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[currentPath]}
          items={[
            {
              key: "tikets",
              icon: (
                <Tooltip
                  title="Solicitudes"
                  placement="right"
                  visible={collapsed ? undefined : false}
                >
                  <FileTextOutlined />
                </Tooltip>
              ),
              label: "Solicitudes",
            },
            {
              key: "manuals",
              icon: (
                <Tooltip
                  title="Soluciones"
                  placement="right"
                  visible={collapsed ? undefined : false}
                >
                  <CheckCircleOutlined />
                </Tooltip>
              ),
              label: "Soluciones",
            },
            {
              key: "asigment",
              icon: (
                <Tooltip
                  title="Asignaciones"
                  placement="right"
                  visible={collapsed ? undefined : false}
                >
                  <SwapOutlined />
                </Tooltip>
              ),
              label: "Asignaciones",
            },
            {
              key: "configuration",
              icon: (
                <Tooltip
                  title="Configuración"
                  placement="right"
                  visible={collapsed ? undefined : false}
                >
                  <SettingOutlined />
                </Tooltip>
              ),
              label: "Configuración",
            },
            // Botón Cerrar Sesión como item de menú
            {
              key: "logout",
              icon: (
                <Tooltip
                  title="Cerrar Sesión"
                  placement="right"
                  visible={collapsed ? undefined : false}
                >
                  <LogoutOutlined />
                </Tooltip>
              ),
              label: "Cerrar Sesión",
              style: { marginTop: "auto" }, // lo empuja al final
            },
          ]}
        />
      </div>
    </div>
  );
}
