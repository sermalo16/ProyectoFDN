import React, { useState, useMemo } from "react";
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
  notification,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAsigmentManager } from "../../../../hooks/asigment/useAsigment.js";

const { Title } = Typography;
const { Option } = Select;

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { inventory, employees, categories, createNewAsigment } =
    useAsigmentManager();

  /* =============================
     STATES
  ============================== */
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  /* =============================
     FILTRAR INVENTARIO POR CATEGORIA (ACTIVOS)
  ============================== */
  const filteredInventory = useMemo(() => {
    if (!selectedCategory) return [];
    return inventory.filter(
      (item) => String(item.id_categoria) === String(selectedCategory)
    );
  }, [inventory, selectedCategory]);

  /* =============================
     ABRIR MODAL ACTIVOS
  ============================== */
  const openAssetModal = (categoriaId) => {
    setSelectedCategory(categoriaId);
    setSelectedItems([]);
    setIsAssetModalOpen(true);
  };

  /* =============================
     AGREGAR ACTIVOS
  ============================== */
  const handleAddAssets = () => {
    const nuevos = selectedItems.filter(
      (item) =>
        !selectedAssets.some(
          (asset) => asset.idinventario === item.idinventario
        )
    );

    setSelectedAssets([...selectedAssets, ...nuevos]);
    setIsAssetModalOpen(false);
  };

  /* =============================
     AGREGAR ACCESORIOS
  ============================== */
  const handleAddAccessories = () => {
    const nuevos = selectedItems.filter(
      (item) =>
        !selectedAccessories.some(
          (acc) => acc.idinventario === item.idinventario
        )
    );

    setSelectedAccessories([...selectedAccessories, ...nuevos]);
    setIsAccessoryModalOpen(false);
  };

  /* =============================
     ELIMINAR
  ============================== */
  const removeAsset = (id) =>
    setSelectedAssets((prev) =>
      prev.filter((item) => item.idinventario !== id)
    );

  const removeAccessory = (id) =>
    setSelectedAccessories((prev) =>
      prev.filter((item) => item.idinventario !== id)
    );

  /* =============================
     GUARDAR
  ============================== */
  const onFinish = async (values) => {
    if (selectedAssets.length === 0) {
      notification.warning({
        message: "Debe agregar al menos un activo",
      });
      return;
    }

    try {
      await createNewAsigment({
        ...values,
        equipos: selectedAssets,
        accesorios: selectedAccessories,
      });

      form.resetFields();
      setSelectedAssets([]);
      setSelectedAccessories([]);
      navigate("/admin/asigment");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/asigment")}
        >
          Volver
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          Nueva Asignación
        </Title>
      </div>

      <Divider />

      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* EMPLEADO */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Empleado"
                name="idempleado"
                rules={[{ required: true }]}
              >
                <Select placeholder="Seleccione empleado">
                  {employees.map((emp) => (
                    <Option
                      key={emp.idempleados}
                      value={emp.idempleados}
                    >
                      {emp.nombre} {emp.apellido}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ================= ACTIVOS ================= */}
          <Divider orientation="left">Activos</Divider>

          <Space style={{ marginBottom: 16 }}>
            <Select
              placeholder="Seleccionar categoría"
              style={{ width: 250 }}
              onChange={(value) => openAssetModal(value)}
            >
              {categories.map((category) => (
                <Option
                  key={category.idcategoria}
                  value={category.idcategoria}
                >
                  {category.categoria}
                </Option>
              ))}
            </Select>
          </Space>

          <Table
            bordered
            pagination={false}
            rowKey="idinventario"
            dataSource={selectedAssets}
            columns={[
              { title: "Código", dataIndex: "codigo_auditoria" },
              { title: "Nombre", dataIndex: "nombre_activo" },
              { title: "Marca", dataIndex: "marca" },
              { title: "Modelo", dataIndex: "modelo" },
              {
                title: "Acciones",
                render: (_, record) => (
                  <Button
                    type="link"
                    danger
                    onClick={() =>
                      removeAsset(record.idinventario)
                    }
                  >
                    Eliminar
                  </Button>
                ),
              },
            ]}
          />

          {/* ================= ACCESORIOS ================= */}
          <Divider orientation="left">Accesorios</Divider>

          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => {
              setSelectedItems([]);
              setIsAccessoryModalOpen(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Agregar Accesorio
          </Button>

          <Table
            bordered
            pagination={false}
            rowKey="idinventario"
            dataSource={selectedAccessories}
            columns={[
              { title: "Código", dataIndex: "codigo_auditoria" },
              { title: "Nombre", dataIndex: "nombre_activo" },
              { title: "Marca", dataIndex: "marca" },
              {
                title: "Acciones",
                render: (_, record) => (
                  <Button
                    type="link"
                    danger
                    onClick={() =>
                      removeAccessory(record.idinventario)
                    }
                  >
                    Eliminar
                  </Button>
                ),
              },
            ]}
          />

          <Divider />

          <Form.Item label="Observaciones" name="observaciones">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={() => navigate("/admin/asigment")}>
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* MODAL ACTIVOS */}
      <Modal
        title="Seleccionar Activos"
        open={isAssetModalOpen}
        onOk={handleAddAssets}
        onCancel={() => setIsAssetModalOpen(false)}
        width={800}
      >
        <Table
          rowKey="idinventario"
          dataSource={filteredInventory}
          rowSelection={{
            type: "checkbox",
            onChange: (_, rows) => setSelectedItems(rows),
          }}
          columns={[
            { title: "Código", dataIndex: "codigo_auditoria" },
            { title: "Nombre", dataIndex: "nombre_activo" },
            { title: "Marca", dataIndex: "marca" },
            { title: "Modelo", dataIndex: "modelo" },
            { title: "Estado", dataIndex: "estado" },
          ]}
        />
      </Modal>

      {/* MODAL ACCESORIOS */}
      <Modal
        title="Seleccionar Accesorios"
        open={isAccessoryModalOpen}
        onOk={handleAddAccessories}
        onCancel={() => setIsAccessoryModalOpen(false)}
        width={800}
      >
        <Table
          rowKey="idinventario"
          dataSource={inventory}
          rowSelection={{
            type: "checkbox",
            onChange: (_, rows) => setSelectedItems(rows),
          }}
          columns={[
            { title: "Código", dataIndex: "codigo_auditoria" },
            { title: "Nombre", dataIndex: "nombre_activo" },
            { title: "Marca", dataIndex: "marca" },
            { title: "Estado", dataIndex: "estado" },
          ]}
        />
      </Modal>
    </div>
  );
}
