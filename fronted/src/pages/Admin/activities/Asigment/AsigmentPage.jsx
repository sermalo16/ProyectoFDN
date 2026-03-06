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
      title: "Activo",
      dataIndex: "nombre_activo"
    },
    {
      title: "Modelo",
      dataIndex: "modelo"
    },
    {
      title: "Marca",
      dataIndex: "marca"
    },
    {
      title: "Service Tag",
      dataIndex: "service_tag"
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
      title: "Estado",
      dataIndex: "estado_detalle",
      render: (estado) => (
        <Tag color={estado === "Asignado" ? "blue" : "green"}>
          {estado}
        </Tag>
      )
    },
    {
      title: "Acciones",
      fixed: "right",
      width: 150,
      render: () => (
        <Button
          type="text"
          icon={<EditOutlined />}
        >
          Devolver
        </Button>
      )
    }
  ];

  /* ===============================
     COMPONENTE ACORDEÓN
  =============================== */
  const AssignmentAccordion = ({ data }) => (
    <Collapse accordion>
      {data.map((item) => (
        <Panel
          key={item.idasignacion}
          header={`#${item.idasignacion} ${item.nombre_empleado} ${item.apellido_empleado} - ${item.departamento}`}
          extra={
            <Tag color={item.estado === "Activa" ? "blue" : "green"}>
              {new Date(item.fecha_asignacion).toLocaleDateString()}
            </Tag>
          }
        >
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <strong>Asignado por:</strong>{" "}
              {item.nombre_asignador} {item.apellido_asignador}
            </Col>

            <Col span={12}>
              <strong>Empresa:</strong> {item.nombreEmpresa}
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
    idasignacion: 1,
    nombre_empleado: "Carlos",
    apellido_empleado: "Mejía",
    departamento: "Soporte Técnico",
    fecha_asignacion: "2026-02-20",
    nombre_asignador: "Sergio",
    apellido_asignador: "Admin",
    nombreEmpresa: "Grupo Funo",
    observaciones: "Equipo entregado en excelente estado.",
    estado: "Activa",
    equipos: [
      {
        idinventario: 101,
        nombre_activo: "Laptop Carlos",
        modelo: "Latitude 5480",
        marca: "Dell",
        service_tag: "ST-4587",
        nuevo_usado: 1,
        estado_detalle: "Asignado",
        valor: 18500
      }
    ]
  }
];

  /* ===============================
    BUSQUEDA
  =============================== */

  const dataSource = asigment.length > 0 ? asigment : mockAssignments;

  const filteredAssignments = useMemo(() => {
    if (!search.trim()) return dataSource;

    const lower = search.toLowerCase();

    return dataSource.filter((item) => {
      return (
        item.idasignacion?.toString().includes(lower) ||
        item.nombre_empleado?.toLowerCase().includes(lower) ||
        item.apellido_empleado?.toLowerCase().includes(lower)
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
          <AssignmentAccordion data={mockAssignments} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </div>
 );
}