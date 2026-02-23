import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Collapse,
  Tag,
  Tabs,
  Card,
  Space,
  Input
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAsigmentManager } from "../../../../hooks/asigment/useAsigment.js";

const { Panel } = Collapse;

export default function AsigmentPage() {
  const { asigment, loading, refreshAsigments } = useAsigmentManager();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* ===============================
     COLUMNAS EQUIPOS
  =============================== */
  const equipmentColumns = [
    {
      title: "Modelo",
      dataIndex: "modelo"
    },
    {
      title: "Marca",
      dataIndex: "marca"
    },
    {
      title: "Serie",
      dataIndex: "serie"
    },
    {
      title: "Service Tag",
      dataIndex: "service_tag"
    },
    {
      title: "Categoría",
      dataIndex: "categoria"
    },
    {
      title: "Condición",
      dataIndex: "nuevo_usado",
      render: (value) =>
        value === 1 ? (
          <Tag color="green">Nuevo</Tag>
        ) : (
          <Tag color="orange">Usado</Tag>
        )
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: (value) => `L ${value}`
    },
    {
      title: "Acciones",
      fixed: "right",
      width: 150,
      render: () => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => navigate("createAsigment")}
        >
          Devolver
        </Button>
      )
    }
  ];

  /* ===============================
     COMPONENTE ACORDEÓN REUTILIZABLE
  =============================== */
  const AssignmentAccordion = ({ data }) => (
    <Collapse accordion>
      {data.map((item) => (
        <Panel
          key={item.idasignaciones}
          header={`${item.nombre} ${item.apellido} - ${item.departamento}`}
          extra={
            <Tag color="blue">
              {item.fecha_asignacion}
            </Tag>
          }
        >
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <strong>Asignado por:</strong> {item.asignado_por}
            </Col>
            <Col span={8}>
              <strong>Mochila:</strong>{" "}
              {item.mochila === 1 ? "Entregado" : "No entregado"}
            </Col>
            <Col span={8}>
              <strong>Mouse:</strong>{" "}
              {item.mouse === 1 ? "Entregado" : "No entregado"}
            </Col>
            <Col span={24}>
              <strong>Observaciones:</strong>{" "}
              {item.observaciones || "Sin observaciones"}
            </Col>
          </Row>

          <Card
            size="small"
            style={{ marginTop: 16 }}
            title="Equipos relacionados"
          >
            <Table
              columns={equipmentColumns}
              dataSource={item.equipos || []}
              rowKey="idinventario"
              pagination={false}
              loading={loading}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Panel>
      ))}
    </Collapse>
  );

  /* ===============================
   MOCK DATA (solo visual)
================================= */
const mockAssignments = [
  {
    idasignaciones: 1,
    nombre: "Carlos",
    apellido: "Mejía",
    departamento: "Soporte Técnico",
    fecha_asignacion: "2026-02-20",
    asignado_por: "Sergio Admin",
    observaciones: "Equipo entregado en excelente estado.",
    mochila: 1,
    mouse: 1,
    equipos: [
      {
        idinventario: 101,
        modelo: "Latitude 5480",
        marca: "Dell",
        serie: "SN123456",
        service_tag: "ST-4587",
        categoria: "Laptop",
        nuevo_usado: 1,
        valor: 18500
      },
      {
        idinventario: 102,
        modelo: "ThinkVision T24",
        marca: "Lenovo",
        serie: "MN789456",
        service_tag: "ST-9988",
        categoria: "Monitor",
        nuevo_usado: 0,
        valor: 5200
      }
    ]
  }
];


/* ===============================
    FUNCIONES DE BUSQUEDA Y FILTRADO
  =============================== */

  const dataSource = asigment.length > 0 ? asigment : mockAssignments;

const filteredAssignments = useMemo(() => {
  if (!search.trim()) return dataSource;

  const lower = search.toLowerCase();

  return dataSource.filter((item) => {
    return (
      item.idasignaciones?.toString().includes(lower) ||
      item.nombre?.toLowerCase().includes(lower) ||
      item.apellido?.toLowerCase().includes(lower)
    );
  });
}, [search, dataSource]);

  /* ===============================
     UI PRINCIPAL
  =============================== */
 return (
  <div>
    {/* HEADER */}
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col>
        <h2 style={{ marginBottom: 0 }}>Gestión de Asignaciones</h2>
        <span style={{ color: "#8c8c8c" }}>
          Control y administración de activos asignados a empleados
        </span>
      </Col>

      <Col>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshAsigments}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("createAsigment")}
          >
            Nueva asignación
          </Button>
        </Space>
      </Col>
    </Row>

    {/* FILTROS */}
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Input.Search
            placeholder="Buscar por # asignación o nombre del empleado"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
    </Card>

    {/* CONTENIDO */}
    <Card>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Asignaciones" key="1">
          <AssignmentAccordion data={filteredAssignments} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Devoluciones" key="2">
          <AssignmentAccordion data={filteredAssignments} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </div>
);
}