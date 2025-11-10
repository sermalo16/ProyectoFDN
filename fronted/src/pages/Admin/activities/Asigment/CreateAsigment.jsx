import React, { useState } from "react";
import {
  Card,
  Button,
  Divider,
  Typography,
  Select,
  Table,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function CreateAsigment() {
  const navigate = useNavigate();

  // Estados
  const [equipos, setEquipos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Datos de ejemplo
  const empleados = ["Juan Pérez", "María López"];
  const empresas = ["Fundidora del Norte S.A", "Tecnologia Agricola S.A"];
  const availableEquipos = [
    { id: 1, tipo: "Laptop", marca: "Dell", modelo: "Latitude 5480" },
    { id: 2, tipo: "Monitor", marca: "HP", modelo: "P24v" },
  ];
  const availableAccesorios = [
    { id: 1, accesorio: "Mouse", cantidad: 1 },
    { id: 2, accesorio: "Teclado", cantidad: 1 },
  ];

  // Columnas
  const columnsEquipos = [
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    { title: "Marca", dataIndex: "marca", key: "marca" },
    { title: "Modelo", dataIndex: "modelo", key: "modelo" },
    { title: "Valor", dataIndex: "Valor", key: "Valor" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => setEquipos(equipos.filter((e) => e.id !== record.id))}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  const columnsAccesorios = [
    { title: "Accesorio", dataIndex: "accesorio", key: "accesorio" },
    { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
    { title: "Valor", dataIndex: "Valor", key: "Valor" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() =>
            setAccesorios(accesorios.filter((a) => a.id !== record.id))
          }
        >
          Eliminar
        </Button>
      ),
    },
  ];

  // Abrir modal
  const openModal = (type) => {
    setModalType(type);
    setSelectedItems([]);
    setIsModalOpen(true);
  };

  // Confirmar selección
  const handleAddSelected = () => {
    if (modalType === "equipos") {
      setEquipos([...equipos, ...selectedItems]);
    } else {
      setAccesorios([...accesorios, ...selectedItems]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="create-ticket-page">
      {/* Encabezado */}
      <div className="header-section">
        <div className="left-header">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate("/admin/asigment")}
          >
            Volver
          </Button>
          <Title level={3} className="page-title">
            Nueva Asignación
          </Title>
        </div>
      </div>
      <Divider />

      {/* Contenedor principal */}
      <Card
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Form
          layout="vertical"
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Selección empleado y empresa */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Empleado" name="empleado">
                <Select placeholder="Seleccione empleado">
                  {empleados.map((e, idx) => (
                    <Option key={idx}>{e}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Empresa" name="empresa">
                <Select placeholder="Seleccione empresa">
                  {empresas.map((e, idx) => (
                    <Option key={idx}>{e}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Equipos */}
          <Divider orientation="left">Equipos a Asignar</Divider>
          <Space style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal("equipos")}
            >
              Agregar equipo
            </Button>
          </Space>
          <Table
            columns={columnsEquipos}
            dataSource={equipos}
            rowKey="id"
            pagination={false}
            bordered
          />

          {/* Accesorios */}
          <Divider orientation="left">Accesorios</Divider>
          <Space style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal("accesorios")}
            >
              Agregar accesorio
            </Button>
          </Space>
          <Table
            columns={columnsAccesorios}
            dataSource={accesorios}
            rowKey="id"
            pagination={false}
            bordered
          />

          {/* Observaciones */}
          <Divider />
          <Form.Item label="Observaciones" name="observaciones">
            <Input.TextArea rows={3} placeholder="Agregar observaciones..." />
          </Form.Item>

          {/* Botones finales */}
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={() => navigate("/admin/asigment")}>
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button type="primary">Guardar Asignación</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Modal */}
      <Modal
        title={
          modalType === "equipos"
            ? "Seleccionar equipo"
            : "Seleccionar accesorio"
        }
        open={isModalOpen}
        onOk={handleAddSelected}
        onCancel={() => setIsModalOpen(false)}
        okText="Agregar"
        cancelText="Cancelar"
        width={700}
      >
        <Table
          columns={
            modalType === "equipos"
              ? [
                  { title: "Tipo", dataIndex: "tipo" },
                  { title: "Marca", dataIndex: "marca" },
                  { title: "Modelo", dataIndex: "modelo" },
                ]
              : [
                  { title: "Accesorio", dataIndex: "accesorio" },
                  { title: "Cantidad", dataIndex: "cantidad" },
                ]
          }
          dataSource={
            modalType === "equipos" ? availableEquipos : availableAccesorios
          }
          rowKey="id"
          pagination={false}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedItems.map((item) => item.id),
            onChange: (_, selectedRows) => setSelectedItems(selectedRows),
          }}
        />
      </Modal>
    </div>
  );
}
