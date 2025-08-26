// src/pages/InventoryManagement/AsigmentPage.jsx
import React, { use, useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  notification,
  Row,
  Col,
  Select,
  Tabs
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";



const { TabPane } = Tabs;
export default function AsigmentPage() {

// Columnas base para tabla de Asignaciones
  const assignmentColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Empleado", dataIndex: "empleado", key: "empleado" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Fecha de Asignación", dataIndex: "fecha", key: "fecha" },
  ];

  // Columnas base para tabla de Devoluciones
  const returnColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Empleado", dataIndex: "empleado", key: "empleado" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Fecha de Devolución", dataIndex: "fecha", key: "fecha" },
  ];


  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Gestión de Asignaciones</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16, marginRight: 20 }}
        
      >
        Nueva Asignacion
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        
      >
        Nueva Devolucion
      </Button>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Asignaciones" key="1">
          <Table
            columns={assignmentColumns}
            dataSource={null}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
        <TabPane tab="Devoluciones" key="2">
          <Table
            columns={returnColumns}
            dataSource={null}
            rowKey="id"            
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

 /*<div>
      <h2>Asignaciones y devoluciones</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16, marginRight: 20 }}
        
      >
        Nueva Asignacion
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        
      >
        Nueva Devolucion
      </Button>
    </div>*/