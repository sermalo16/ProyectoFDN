//Cosigo de app.js

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import EmployeesPage  from "./pages/Employees/EmployeesPage"
import DepartmentsPage from "./pages/Employees/DepartmentsPage"; 
import InventoryPages from "./pages/InventoryManagement/InventoryPages";
import AsigmentPage from "./pages/InventoryManagement/AsigmentPage";
import CategoryInv from "./pages/InventoryManagement/CategoryPages";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route
          path="/admin"
          element={isAuth ? <AdminPanel /> : <Navigate to="/login" />}
        >

          {/* Nuevas rutas anidadas para Gestión de empleados */}
          <Route index element={<EmployeesPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />

           {/* Nuevas rutas anidadas para Gestión de Equipos */}
          <Route path="inventario" element={<InventoryPages />} />
          <Route path="asignaciones" element={<AsigmentPage />} />
          <Route path="Categorias" element={<CategoryInv />} />


        </Route>




        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;



//codigo de adminPanel.js

import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/AdminPanel.scss";

const { Header, Sider, Content } = Layout;

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // obtiene el path después de /admin/ej: employees, departments, etc.
  const currentPath = location.pathname.split("/")[2] || "employees";

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else if (key === "users") {
      // 🚫 No hacer nada por ahora
      return;
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider className="admin-sider">
        <div className="logo">Panel Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[currentPath]}
          defaultOpenKeys={["employees-group"]} // 👈 Menú desplegado por defecto
        >
          {/* Gestión de empleados */}
          <Menu.SubMenu
            key="employees-group"
            icon={<TeamOutlined />}
            title="Gestión de empleados"
          >
            <Menu.Item key="employees" icon={<UserOutlined />}>
              Empleados
            </Menu.Item>
            <Menu.Item key="departments" icon={<ApartmentOutlined />}>
              Departamentos
            </Menu.Item>
          </Menu.SubMenu>

          {/* Gestión de Equipos */}
          <Menu.SubMenu
            key="equipos-group"
            icon={<SettingOutlined />}
            title="Gestión de Equipos"
          >
            <Menu.Item key="inventario" icon={<ApartmentOutlined />}>
              Inventario
            </Menu.Item>
            <Menu.Item key="asignaciones" icon={<UserOutlined />}>
              Asignaciones
            </Menu.Item>
            <Menu.Item key="Categorias" icon={<ApartmentOutlined />}>
              Categorias
            </Menu.Item>
          </Menu.SubMenu>
          
          {/* Usuarios */}
          <Menu.Item key="users" icon={<SettingOutlined />}>
            Usuarios
          </Menu.Item>

          {/* Cerrar sesión */}
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Cerrar sesión
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="admin-header">
          <h2>Panel de Administración</h2>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}


//version anteriro
/*import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Popconfirm,
  message,
  notification,
  Select,
  Upload,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employees";
import { getDepartments } from "../../services/department";
import defaultImage from "../../assets/empledo.png";


export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultImage);
  const [departments, setDepartments] = useState([]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al cargar empleados.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Error al cargar departamentos";
      message.error(msg);
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
      ...employee,
      fecha_nacimiento: moment(employee.fecha_nacimiento),
      fecha_ingreso: moment(employee.fecha_ingreso),
      iddepartamentos: employee.iddepartamentos || null,
    });

    // Si hay foto guardada, cargarla como vista previa
    if (employee.foto) {
      setPreviewImage(employee.foto);
    } else {
      setPreviewImage(defaultImage);
    }
  } else {
    setPreviewImage(defaultImage); // 👉 imagen por defecto
  }

  setIsModalOpen(true);
};


  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      notification.success({
        message: "Eliminado",
        description: "Empleado eliminado correctamente.",
        placement: "topRight",
        duration: 3,
      });
      fetchEmployees();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Error al eliminar empleado";
      notification.error({
        message: "Error",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const field = key === "iddepartamentos" ? "iddepartamento" : key;

        if (values[key] instanceof moment) {
          formData.append(field, values[key].format("YYYY-MM-DD"));
        } else {
          formData.append(field, values[key]);
        }
      });

      if (imageFile) {
        formData.append("foto", imageFile);
      }

      if (editingEmployee) {
        await updateEmployee(editingEmployee.idempleados, formData);
        notification.success({
          message: "Actualizado",
          description: "Empleado actualizado correctamente.",
          placement: "topRight",
          duration: 3,
        });
      } else {
        await createEmployee(formData);
        notification.success({
          message: "Creado",
          description: "Empleado creado correctamente.",
          placement: "topRight",
          duration: 3,
        });
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Error al guardar empleado";
      notification.error({
        message: "Error",
        description: msg,
        placement: "bottomRight",
        duration: 3,
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "idempleados" },
    {
  title: "Foto",
  dataIndex: "foto",
  render: (foto) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img
        src={foto || defaultImage}
        alt="Empleado"
        style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
      />
    </div>
  ),
},
    { title: "DNI", dataIndex: "identidad" },
    { title: "Código RRHH", dataIndex: "rrh_codigo" },
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Apellido", dataIndex: "apellido" },
    { title: "Puesto", dataIndex: "puesto" },
    { title: "Fecha Nacimiento", dataIndex: "fecha_nacimiento" },
    { title: "Fecha Ingreso", dataIndex: "fecha_ingreso" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Departamento", dataIndex: "departamento" },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.idempleados)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cuando seleccionas imagen en Upload, actualizar preview de foto
  const handleImageChange = (file) => {
  setImageFile(file);
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewImage(reader.result); // base64 para vista previa
  };
  reader.readAsDataURL(file);
};

  return (
    <div>
      <h2>Gestión de Empleados</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Crear nuevo
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        scroll={{ x: "max-content", y: "max-content" }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editingEmployee ? "Editar empleado" : "Crear nuevo empleado"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingEmployee ? "Actualizar" : "Crear"}
        destroyOnClose
        width={700} // ancho un poco más grande para dos columnas cómodas
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
                label="DNI"
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
                name="iddepartamentos"
                label="Departamento"
                rules={[
                  { required: true, message: "Selecciona un departamento" },
                ]}
              >
                <Select placeholder="Selecciona un departamento">
                  {departments?.map((dep) => (
                    <Select.Option
                      key={dep.iddepartamentos}
                      value={dep.iddepartamentos}
                    >
                      {dep.departamento}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}*/