import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Row,
  Col,
  Avatar,
  Tabs,
} from "antd";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [ticketsPendientes, setTicketsPendientes] = useState([]);
  const [ticketsResueltos, setTicketsResueltos] = useState([]);

  // 🔧 Datos mock (luego conectas con tu API)
  useEffect(() => {
    // Simulación de datos del usuario
    setUser({
      nombre: "Sergio",
      apellido: "Morel",
      correo: "sergio@example.com",
      tipo_usuario: "Técnico", // puede ser "Solicitante"
      imagen: "https://randomuser.me/api/portraits/men/32.jpg", // Foto de prueba
    });

    // Simulación de asignaciones
    setAssignments([
      { id: 1, equipo: "Laptop Dell", fecha: "2025-09-01", estado: "Asignado" },
      { id: 2, equipo: "Monitor LG", fecha: "2025-09-02", estado: "Asignado" },
    ]);

    // Simulación de tickets
    setTicketsPendientes([
      { id: 101, descripcion: "Error en impresora", fecha: "2025-09-01" },
      { id: 102, descripcion: "No conecta al WiFi", fecha: "2025-09-02" },
    ]);

    setTicketsResueltos([
      { id: 201, descripcion: "Pantalla rota", fecha: "2025-08-20" },
      { id: 202, descripcion: "Problema con correo", fecha: "2025-08-25" },
    ]);
  }, []);

  // Columnas para asignaciones
  const columnsAsignaciones = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => (
        <Tag color={estado === "Asignado" ? "green" : "red"}>{estado}</Tag>
      ),
    },
  ];

  // Columnas para tickets
  const columnsTickets = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Perfil del Usuario</h2>

      {/* Card con información del usuario */}
      {user && (
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            {/* Imagen */}
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar size={120} src={user.imagen} />
            </Col>

            {/* Datos */}
            <Col span={18}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Nombre">
                  {user.nombre} {user.apellido}
                </Descriptions.Item>
                <Descriptions.Item label="Correo">
                  {user.correo}
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Usuario">
                  <Tag
                    color={user.tipo_usuario === "Técnico" ? "blue" : "orange"}
                  >
                    {user.tipo_usuario}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      )}

      {/* Tabla de asignaciones */}
      <Card title="Asignaciones actuales" style={{ marginBottom: 24 }}>
        <Table
          columns={columnsAsignaciones}
          dataSource={assignments}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Tabla de tickets */}
      <Card title="Tickets del Usuario">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Pendientes" key="1">
            <Table
              columns={columnsTickets}
              dataSource={ticketsPendientes}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Resueltos" key="2">
            <Table
              columns={columnsTickets}
              dataSource={ticketsResueltos}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}