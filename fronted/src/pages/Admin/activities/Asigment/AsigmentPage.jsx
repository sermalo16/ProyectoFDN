import React from "react";
import { Table, Button, Row, Col, Collapse, Tag, Tabs } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAsigmentManager } from "../../../../hooks/asigment/useAsigment.js";

const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function AsigmentPage() {
  const { asigment, loading } = useAsigmentManager();
  const navigate = useNavigate();

  // 📋 Columnas para tabla de devoluciones (placeholder)
  const returnColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Empleado", dataIndex: "empleado", key: "empleado" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Fecha de Devolución", dataIndex: "fecha", key: "fecha" },
  ];

  // 🧩 Acordeón de asignaciones
  const AsignacionesAccordion = ({ asignaciones }) => {
    const columns = [
      {
        title: "Equipo Asignado",
        dataIndex: "marca",
        key: "marca",
        render: (text, record) => (
          <span>
            <strong>{text}</strong> ({record.marca || "N/A"} -{" "}
            {record.modelo || "N/A"})
          </span>
        ),
      },
      { title: "Service Tag", dataIndex: "service_tag", key: "service_tag" },
      { title: "Serie", dataIndex: "serie", key: "serie" },
      { title: "Categoria", dataIndex: "categoria", key: "categoria" },
      {
        title: "Nuevo/Usado",
        dataIndex: "nuevo_usado",
        key: "nuevo_usado",
        render: (value) => (value === 1 ? "Nuevo" : "Usado"),
      },
      {
        title: "Valor",
        dataIndex: "valor",
        key: "valor",
        render: (value) => `L ${value}`,
      },
      {
        title: "Acciones",
        key: "acciones",
        fixed: "right",
        render: (_, record) => (
          <Row gutter={[8, 8]}>
            <Col>
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate("createAsigment")}
                size="small"
              >
                Devolver Activo
              </Button>
            </Col>
          </Row>
        ),
      },
    ];

    return (
      <Collapse accordion>
        {asignaciones.map((item) => (
          <Panel
            key={item.idasignaciones}
            header={`${item.total_registros}# ${item.nombre} ${item.apellido} - ${item.departamento}`}
            extra={
              <Tag color="blue">
                {"Fecha de la asignación: " + item.fecha_asignacion}
              </Tag>
            }
          >
            <p>
              <strong>Asignado por:</strong> {item.asignado_por}
            </p>
            <p>
              <strong>Observaciones:</strong>{" "}
              {item.observaciones || "Sin observaciones"}
            </p>
            <p>
              <strong>Mochila:</strong>{" "}
              {item.mochila === 1 ? "Entregado" : "No entregado"}
            </p>
            <p>
              <strong>Mouse:</strong>{" "}
              {item.mouse === 1 ? "Entregado" : "No entregado"}
            </p>

            <h4>Equipos asignados:</h4>
            {item.equipos?.length > 0 ? (
              <Table
                columns={columns}
                dataSource={item.equipos}
                rowKey={(record) => record.idinventario}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <p>No hay equipos asignados.</p>
            )}
          </Panel>
        ))}
      </Collapse>
    );
  };

  // ==============================
  // Render principal
  // ==============================
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Gestión de Asignaciones</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16, marginRight: 20 }}
        onClick={() => navigate("createAsigment")}
      >
        Nueva Asignación
      </Button>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Asignaciones" key="1">
          <AsignacionesAccordion asignaciones={asigment} />
        </TabPane>

        <TabPane tab="Devoluciones" key="2">
          <Table
            columns={returnColumns}
            dataSource={[]} // vacío hasta implementar devoluciones reales
            rowKey="iddevoluciones"
            pagination={{ pageSize: 5 }}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
