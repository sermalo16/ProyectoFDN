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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createInventory,
  updateInventory,
  deleteInventory,
  getInventory,
} from "../../services/Inventory";

import { getCategories } from "../../services/categories";

export default function InventoryPages() {
  const [inventory, setInventory] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingInventory, setEditingInventory] = useState(null);

  // 🔧 Placeholder para futuros datos
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // TODO: conectar con tu servicio real
      const data = await getInventory();      
      setInventory(data);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Error al cargar el inventario.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategories();
      setCategory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchCategory();
  }, []);

  const openModal = (item = null) => {
    setEditingInventory(item);
    setIsModalOpen(true);
    form.resetFields();

    if (item) {
      form.setFieldsValue(item);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingInventory) {
              const res = await updateInventory(
                editingInventory.idinventario,
                values
              );
              notification.success({
                message: "Actualizado",
                description: res.message || "Activo actualizado correctamente.",
                placement: "topRight",
                duration: 3,
              });
            } else {
              const res = await createInventory(values);
              console.log(res);
              notification.success({
                message: "Creado",
                description: res.message || "Equipo creado correctamente.",
                placement: "topRight",
                duration: 3,
              });
            }

      setIsModalOpen(false);
      fetchInventory();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al guardar el equipo.",
        placement: "bottomRight",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: conectar con tu servicio
      const res = await deleteInventory(id);
      notification.success({
        message: "Eliminado",
        description: res.message || "Activo eliminado correctamente.",
        placement: "topRight",
        duration: 3,
      });
      fetchInventory();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al eliminar equipo.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "total_registros",
      key: "total_registros",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Datos del Activo",
      dataIndex: "nombre_activo",
      key: "nombre_activo",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Codigo de Auditoria",
      dataIndex: "codigo_auditoria",
      key: "codigo_auditoria",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Service Tag",
      dataIndex: "service_tag",
      key: "service_tag",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Descripcion del activo",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Modelo",
      dataIndex: "modelo",
      key: "modelo",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Serie",
      dataIndex: "serie",
      key: "serie",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Fecha de Adquisicion",
      dataIndex: "fecha_ingreso",
      key: "fecha_ingreso",
      width: 200,
      ellipsis: true,
    },
    {
      title: "valor del activo",
      dataIndex: "valor",
      key: "valor",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Acciones",
      fixed: "right",
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Button
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              size="small"
            >
              Editar Activo
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="¿Seguro que deseas eliminar?"
              onConfirm={() => handleDelete(record.idinventario)}
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Eliminar Activo
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <h2>Gestión de Inventario</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Agregar nuevo equipo
      </Button>

      <Table
        rowKey="idinventario"
        columns={columns}
        dataSource={inventory}
        loading={loading}
        scroll={{ x: "max-content", y: 400 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editingInventory ? "Editar equipo" : "Agregar nuevo equipo"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingInventory ? "Actualizar" : "Crear"}
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="codigo_auditoria"
                label="Código de auditoría"
                rules={[
                  { required: true, message: "Ingrese el código de auditoría" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="idcategoria"
                label="Categoria"
                rules={[
                  { required: true, message: "Selecciona una categoria" },
                ]}
              >
                <Select placeholder="Selecciona">
                  {category.map((d) => (
                    <Option key={d.idcategoria} value={d.idcategoria}>
                      {d.categoria}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="service_tag"
                label="Service Tag"
                rules={[{ required: true, message: "Ingrese el Service Tag" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nombre_activo"
                label="Nombre del activo"
                rules={[
                  { required: true, message: "Ingrese el nombre del activo" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="marca"
                label="Marca"
                rules={[{ required: true, message: "Ingrese la marca" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="modelo"
                label="Modelo"
                rules={[{ required: true, message: "Ingrese el modelo" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serie"
                label="Serie"
                rules={[{ required: true, message: "Ingrese la serie" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="valor"
                label="Valor (Lempiras)"
                rules={[
                  { required: true, message: "Ingrese el valor del equipo" },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: "Ingrese una descripción" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
