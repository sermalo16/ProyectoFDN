// src/pages/TiketPage.jsx
import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Dropdown,
  Menu,
  Avatar,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  MailOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./TiketPage.scss";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const initialData = [
  {
    key: "1",
    id: 757,
    subject: "Compra de Impresora a Color",
    requester: "Aparicio Mejía",
    date: "Mon 13-Oct",
    status: "Open",
    technician: "Sergio Morel",
  },
  {
    key: "2",
    id: 734,
    subject:
      "Cambio de Computadora de Escritorio a Laptop Encargado de Despacho",
    requester: "Aparicio Mejía",
    date: "Mon 22-Sep",
    status: "Open",
    technician: "Sergio Morel",
  },
];

export default function TiketPage() {
  const [data, setData] = useState(initialData);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();

  const technicians = ["Sergio Morel", "Ana Pérez", "Luis Gómez"];

  const handleTechnicianChange = (value, recordKey) => {
    setData((prev) =>
      prev.map((r) => (r.key === recordKey ? { ...r, technician: value } : r))
    );
  };

  const menu = (
    <Menu
      items={[
        { key: "1", label: "Editar" },
        { key: "2", label: "Recoger" },
        { key: "3", label: "Cerrar" },
        { key: "4", label: "Eliminar" },
      ]}
    />
  );

  const columns = [
    {
      title: (
        <div className="header-left">
          <input
            type="checkbox"
            className="select-all"
            checked={selectedKeys.length === data.length}
            onChange={(e) =>
              setSelectedKeys(e.target.checked ? data.map((d) => d.key) : [])
            }
          />
          <span className="title">Asunto</span>
        </div>
      ),
      dataIndex: "subject",
      key: "subject",
      render: (text, record) => (
        <div className="subject-cell">
          <Tag color="orange">#{record.id}</Tag>
          <div className="subject-main">
            <div className="subject-title">{text}</div>
            <div className="subject-meta">
              Por {record.requester} | En {record.date} | Estado de la aprobación: -
            </div>
          </div>
        </div>
      ),
      width: "55%",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div className="status-cell">
          <Tag color="green">{status}</Tag>
        </div>
      ),
      width: "12%",
    },
    {
      title: "Técnico",
      dataIndex: "technician",
      key: "technician",
      render: (tech, record) => (
        <div className="tech-cell">
          <Avatar size={18} className="online-avatar" />
          <Select
            value={tech}
            onChange={(value) => handleTechnicianChange(value, record.key)}
            bordered={false}
            dropdownMatchSelectWidth={false}
            className="tech-select"
          >
            {technicians.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
        </div>
      ),
      width: "18%",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (text, record) => (
        <Space size="middle" className="actions-cell">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<MailOutlined />} />
          <Button type="text" icon={<LinkOutlined />} />
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Space>
      ),
      width: "15%",
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
  };

  return (
    <div className="tiket-page">
      <div className="tiket-header">
        <h2>Mis solicitudes pendientes</h2>

        <Space>
          <Button type="primary" onClick={() => navigate("/admin/createTiket")}>
            Nuevo incidente
          </Button>

          <Dropdown overlay={menu}>
            <Button>
              Más acciones <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>

      <div className="tiket-table">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={() => "dark-row"}
        />
      </div>
    </div>
  );
}
