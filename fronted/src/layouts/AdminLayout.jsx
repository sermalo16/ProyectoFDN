import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminSider from "../components/Admin/Adminsider";
import AdminHeader from "../components/Admin/AdminHeader";
import "./AdminLayout.scss";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className="admin-layout">
      <AdminSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <AdminHeader collapsed={collapsed} />
        <Content
          className="admin-content"
          style={{
            marginLeft: collapsed ? 80 : 200,
            padding: "24px",
            minHeight: "calc(100vh - 64px)", // 64px = altura del Header
            background: "#f0f2f5",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
