import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminSider from "../components/Admin/Header y Sider/AdminSider";
import AdminHeader from "../components/Admin/Header y Sider/AdminHeader";
import "./AdminLayout.scss";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(true); // ✅ colapsado por defecto

  return (
    <Layout className="admin-layout">
      <AdminSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="admin-main">
        <AdminHeader collapsed={collapsed} />
        <Content
          className={`admin-content ${collapsed ? "collapsed" : "expanded"}`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
