// src/pages/CreateTiketPage.jsx
import React, { useState } from "react";
import {
  Select,
  Button,
  Divider,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SolicitudesVariasForm from "../../../../components/Admin/Tikets/SolicitudesVariasForm";
import SucursalesForm from "../../../../components/Admin/Tikets/SucursalesForm";
import AsistenciaProgramasForm from "../../../../components/Admin/Tikets/AsistenciaProgramasForm";
import CorreoForm from "../../../../components/Admin/Tikets/CorreoForm";
import EquipoForm from "../../../../components/Admin/Tikets/EquipoForm";
import "./CreateTiketPage.scss";

const { Option } = Select;
const { Title } = Typography;

export default function CreateTiketPage() {
  const [form, setForm] = useState("solicitudes");
  const navigate = useNavigate();
  const handleMenuClick = (value) => setForm(value);

  const opcionesFormulario = [
    { value: "sucursales", label: "🏢 Sucursales" },
    { value: "asistencia", label: "🧩 Asistencia con Programas" },
    { value: "correo", label: "📧 Correo Electrónico" },
    { value: "equipo", label: "💻 Equipo de Cómputo" },
    { value: "solicitudes", label: "📂 Solicitudes Varias" },
  ];
  const formComponents = {
    sucursales: <SucursalesForm />,
    solicitudes: <SolicitudesVariasForm />,
    asistencia: <AsistenciaProgramasForm />,
    correo: <CorreoForm />,
    equipo: <EquipoForm />,
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
            onClick={() => navigate("/admin/tikets")}
          >
            Regresar
          </Button>
          <Title level={3} className="page-title">
            Nuevo incidente
          </Title>
        </div>

        <div className="right-header">
          <span>Seleccionar plantilla</span>
          <Select
            defaultValue="solicitudes"
            onChange={handleMenuClick}
            className="select-trigger"
            style={{ width: 220 }}
          >
            {opcionesFormulario.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <Divider />
      {formComponents[form]}
    </div>
  );
}
