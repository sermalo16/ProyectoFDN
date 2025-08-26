import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  notification,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categories"; // Asegúrate de tener este archivo

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      message.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (cat = null) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
    form.resetFields();

    if (cat) {
      form.setFieldsValue(cat);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        const res = await updateCategory(editingCategory.idcategoria, values);
        notification.success({
          message: "Actualizado",
          description: res.message || "Categoría actualizada correctamente.",
          placement: "topRight",
          duration: 3,
        });
      } else {
        const res = await createCategory(values);
        notification.success({
          message: "Creado",
          description: res.message || "Categoría creada correctamente.",
          placement: "topRight",
          duration: 3,
        });
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al guardar la categoría.",
        placement: "bottomRight",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);
      notification.success({
        message: "Eliminado",
        description: res.message || "Categoría eliminada correctamente.",
        placement: "topRight",
        duration: 3,
      });
      fetchCategories();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al eliminar la categoría.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "idcategoria" },
    { title: "Categoría", dataIndex: "categoria" },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.idcategoria)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Gestión de Categorías</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Crear nueva
      </Button>

      <Table
        rowKey="idcategoria"
        columns={columns}
        dataSource={categories}
        loading={loading}
        scroll={{ x: "max-content", y: 400 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editingCategory ? "Editar Categoría" : "Crear nueva Categoría"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingCategory ? "Actualizar" : "Crear"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoria"
            label="Nombre de la categoría"
            rules={[
              { required: true, message: "Ingrese el nombre de la categoría" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
