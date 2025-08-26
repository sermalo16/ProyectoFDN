import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Popconfirm,
  notification,
  Upload,
  Tabs
} from "antd";
import { useEffect, useState } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../../services/employees";
import { getDepartments } from "../../services/department";
import moment from "moment";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

import defaultImage from "../../assets/empledo.png";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultImage);
  const [tipo_usuario, setTipo_Usuario] = useState("Tecnico");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      console.log(data);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();

      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const openModal = async (employee = null) => {
    setEditingEmployee(employee);
    setImageFile(null);

    if (departments.length === 0) {
      await fetchDepartments();
    }

    form.resetFields();

    if (employee) {
      form.setFieldsValue({
        identidad: employee.identidad,
        rrh_codigo: employee.rrh_codigo,
        nombre: employee.nombre,
        apellido: employee.apellido,
        puesto: employee.puesto,
        fecha_nacimiento: moment(employee.fecha_nacimiento),
        fecha_ingreso: moment(employee.fecha_ingreso),
        telefono: employee.telefono,
        iddepartamento: employee.iddepartamento,
        departamento: employee.departamento,
        correo: employee.correo,
        descripcion: employee.descripcion,
        tipo_usuario: employee.tipo_usuario,
      });

      setPreviewImage(employee.foto || defaultImage);
    } else {
      setPreviewImage(defaultImage);
    }

    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      // Asegúrate de que imageFile sea un File válido
      if (imageFile) {
        formData.append("foto", imageFile);
      }

      const empleado = {
        identidad: values.identidad,
        rrh_codigo: values.rrh_codigo,
        nombre: values.nombre,
        apellido: values.apellido,
        puesto: values.puesto,
        fecha_nacimiento: values.fecha_nacimiento.format("YYYY-MM-DD"),
        fecha_ingreso: values.fecha_ingreso.format("YYYY-MM-DD"),
        telefono: values.telefono,
        iddepartamento: values.iddepartamento,
      };

      const usuario = {
        correo: values.correo,
        clave: values.clave || "123456789",
        estado: 1,
        descripcion: values.descripcion || "Usuario nuevo",
        tipo_usuario,
      };

      formData.append("empleado", JSON.stringify(empleado));
      formData.append("usuario", JSON.stringify(usuario));

      if (editingEmployee) {
        await updateEmployee(editingEmployee.idusuarios, formData);
        notification.success({ message: "Empleado actualizado correctamente" });
      } else {
        await createEmployee(formData);
        notification.success({ message: "Empleado creado correctamente" });
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      const msg = err?.message || "Error al guardar empleado";
      notification.error({ message: "Error", description: msg });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (idusuarios) => {
    try {
      await deleteEmployee(idusuarios);
      notification.success({ message: "Empleado eliminado correctamente" });
      fetchEmployees();
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al eliminar empleado";
      notification.error({ message: "Error", description: msg });
    }
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // base64 para vista previa
    };
    reader.readAsDataURL(file);
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
      title: "Foto",
      dataIndex: "foto",
      render: (foto) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={foto || defaultImage}
            alt="Empleado"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              borderRadius: 4,
            }}
          />
        </div>
      ),
      key: "foto",
      width: 100,
      ellipsis: true,
    },

    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Identidad",
      dataIndex: "identidad",
      key: "identidad",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Puesto",
      dataIndex: "puesto",
      key: "puesto",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Tipo Usuario",
      dataIndex: "tipo_usuario",
      key: "tipo_usuario",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",
      width: 150,
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
              Editar
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="¿Seguro que deseas eliminar?"
              onConfirm={() => handleDelete(record.idusuarios)}
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Eliminar
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <>
      <h2>Gestión de Empleados</h2>
      <Row justify="start" style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginRight: 16 }}
          onClick={() => {
            setTipo_Usuario("Tecnico");
            openModal();
          }}
        >
          Nuevo Tecnico
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setTipo_Usuario("Solicitante");
            openModal();
          }}
        >
          Nuevo Solicitante
        </Button>
      </Row>

      <Tabs>
        <TabPane tab="Tecnicos" key="1"> 
          <Table
        rowKey="idusuarios"
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{
          x: "max-content", // para scroll horizontal si hay muchas columnas
          y: 400, // altura fija para scroll vertical
        }}
      />
        </TabPane>
        <TabPane tab="Solicitantes" key="2">

        </TabPane>
      </Tabs>

      

      <Modal
        title={
          editingEmployee
            ? editingEmployee.tipo_usuario === "Solicitante"
              ? "Editar solicitante"
              : "Editar Tecnico"
            : tipo_usuario === "Solicitante"
            ? "Nuevo Solicitante"
            : "Nuevo Tecnico"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 24,
            }}
          >
            <img
              src={previewImage}
              alt="Foto del empleado"
              style={{
                width: 150,
                height: 150,
                objectFit: "contain",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                handleImageChange(file);
                return false; // evitar subida automática
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
            </Upload>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="identidad"
                label="Identidad"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rrh_codigo"
                label="Código RRHH"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apellido"
                label="Apellido"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="puesto"
                label="Puesto"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="iddepartamento"
                label="Departamento"
                rules={[
                  { required: true, message: "Selecciona un departamento" },
                ]}
              >
                <Select placeholder="Selecciona">
                  {departments.map((d) => (
                    <Option key={d.iddepartamentos} value={d.iddepartamentos}>
                      {d.departamento}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="fecha_nacimiento"
                label="Fecha de nacimiento"
                rules={[{ required: true }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fecha_ingreso"
                label="Fecha de ingreso"
                rules={[{ required: true }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="correo"
                label="Correo"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="clave" label="Contraseña">
                <Input.Password placeholder="********" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="descripcion" label="Descripción">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeesPage;
