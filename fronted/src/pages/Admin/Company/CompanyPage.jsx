import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Avatar,
  Typography,
  notification,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./CompanyPage.scss";

// Simulación temporal de datos (reemplazar por tu servicio real)
const mockCompanies = [
  {
    id: 1,
    nombre: "Fundidora del Norte S.A.",
    rtn: "08011999123456",
    descripcion: "Empresa dedicada a la fundición de metales industriales.",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    nombre: "TechSolutions S.A.",
    rtn: "08012000123456",
    descripcion: "Servicios tecnológicos y consultoría informática.",
    imagen: "https://via.placeholder.com/100",
  },
];

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simulación de carga de datos
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Aquí iría tu servicio real: const data = await getCompanies();
      setTimeout(() => {
        setCompanies(mockCompanies);
        setLoading(false);
      }, 800);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Error al cargar las empresas.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = (id) => {
    // Aquí podrías llamar a tu API deleteCompany(id)
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    notification.success({
      message: "Eliminada",
      description: "La empresa ha sido eliminada correctamente.",
    });
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "imagen",
      key: "imagen",
      render: (text) => <Avatar src={text} shape="square" size={64} />,
    },
    {
      title: "Nombre de la empresa",
      dataIndex: "nombre",
      key: "nombre",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "RTN",
      dataIndex: "rtn",
      key: "rtn",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      ellipsis: true,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/editCompany/${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar empresa?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="company-page">
      {/* Encabezado */}
      <div className="header-section">
        <Typography.Title level={3} className="page-title">
          Gestión de Empresas
        </Typography.Title>

        <Space>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={fetchCompanies}
          >
            Recargar
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/createCompany")}
          >
            Nueva empresa
          </Button>
        </Space>
      </div>

      {/* Tabla de empresas */}
      <Table
        columns={columns}
        dataSource={companies}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
}
