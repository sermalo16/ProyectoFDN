import React from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Row,
  Col,
  Select,
  Input,
  Card,
  Tag
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useInventoryPage } from "../../../hooks/Inventory/useInventoryPage";

const { Option } = Select;

export default function InventoryPages() {
  const navigate = useNavigate();

  const {
    inventory,
    categories,
    loading,

    search,
    setSearch,
    filterCategoria,
    setFilterCategoria,
    filterEstado,
    setFilterEstado,
    resetFilters,

    handleDelete,
    refreshInventory
  } = useInventoryPage();

  const handleSearchChange = (value) => {
  setSearch(value);

  if (value.trim() !== "") {
    setFilterCategoria("Todos");
    setFilterEstado("Todos");
  }
};

  /* =====================
     COLUMNAS
  ===================== */
  const columns = [
    {
      title: "#",
      dataIndex: "item_num"
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
      title: "Serie",
      dataIndex: "serie"
    },
    {
      title: "Service Tag",
      dataIndex: "service_tag"
    },
    {
      title: "Codigo Auditoria",
      dataIndex: "codigo_auditoria"
    },
    {
      title: "Valor",
      dataIndex: "valor"
    },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (estado) => {
        const color =
          estado === "DISPONIBLE"
            ? "green"
            : estado === "ASIGNADO"
            ? "blue"
            : "orange";
        return <Tag color={color}>{estado}</Tag>;
      }
    },
    {
      title: "Acciones",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/inventario/editar/${record.idinventario}`)
            }
          />
          <Popconfirm
            title="¿Eliminar este activo?"
            onConfirm={() => handleDelete(record.idinventario)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  /* =====================
     UI
  ===================== */
  return (
    <div>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ marginBottom: 0 }}>Inventario IT</h2>
          <span style={{ color: "#8c8c8c" }}>
            Gestión y control de activos tecnológicos
          </span>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshInventory}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("createInventory")}
            >
              Nuevo activo
            </Button>
          </Space>
        </Col>
      </Row>

      {/* FILTROS */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input.Search
              placeholder="Buscar por service tag, código o serie"
              value={search}
              allowClear
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </Col>

          <Col span={5}>
            <Select
              placeholder="Categoría"
              allowClear
              value={filterCategoria}
              style={{ width: "100%" }}
              onChange={setFilterCategoria}
            >
              <Option value="Todos">Todos</Option>
              {categories.map((c) => (
                <Option key={c.idcategoria} value={c.idcategoria}>
                  {c.categoria}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={5}>
            <Select
              placeholder="Estado"
              allowClear
              value={filterEstado}
              style={{ width: "100%" }}
              onChange={setFilterEstado}
            >
              <Option value="Todos">Todos</Option>
              <Option value="disponible">Disponible</Option>
              <Option value="asignado">Asignado</Option>
              <Option value="reparacion">Reparación</Option>
              <Option value="prestamo">Préstamo</Option>
            </Select>
          </Col>

          <Col span={4}>
            <Button block onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </Col>
        </Row>
      </Card>

      {/* TABLA */}
      <Table
        rowKey="idinventario"
        columns={columns}
        dataSource={inventory}
        loading={loading}
        pagination={{ pageSize: 20 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
