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
  Row,
  Col
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/department";


export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingDepartment, setEditingDepartment] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      message.error("Error al cargar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openModal = (dep = null) => {
    
    setEditingDepartment(dep);
    setIsModalOpen(true);
    form.resetFields();

    if (dep) {
      form.setFieldsValue(dep);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingDepartment) {
        const res = await updateDepartment(
          editingDepartment.iddepartamentos,
          values
        );
        notification.success({
          message: "Actualizado",
          description: res.message || "Departamento actualizado correctamente.",
          placement: "topRight",
          duration: 3,
        });
      } else {
        const res = await createDepartment(values);
        console.log(res);
        notification.success({
          message: "Creado",
          description: res.message || "Departamento creado correctamente.",
          placement: "topRight",
          duration: 3,
        });
      }

      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al guardar el departamento.",
        placement: "bottomRight",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteDepartment(id);
      notification.success({
        message: "Eliminado",
        description: res.message || "Departamento eliminado correctamente.",
        placement: "topRight",
        duration: 3,
      });
      fetchDepartments();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al eliminar departamento.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "iddepartamentos" },
    { title: "Departamento", dataIndex: "departamento" },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.iddepartamentos)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Gestión de Departamentos</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Crear nuevo
      </Button>

      <Table
        rowKey="iddepartamentos"
        columns={columns}
        dataSource={departments}
        loading={loading}
        scroll={{ x: "max-content", y: 400 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={
          editingDepartment ? "Editar Departamento" : "Crear nuevo Departamento"
        }
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingDepartment ? "Actualizar" : "Crear"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="departamento"
            label="Departamento"
            rules={[
              { required: true, message: "Ingrese el nombre del departamento" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
