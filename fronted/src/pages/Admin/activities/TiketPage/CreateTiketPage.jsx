// src/pages/CreateTiketPage.jsx
import React, { useState, lazy, Suspense, useMemo } from "react";
import {
  Select,
  Button,
  Divider,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./CreateTiketPage.scss";


// Lazy loading de formularios con rutas correctas
const SucursalesForm = lazy(() => import("../../../../components/Admin/Tikets/SucursalesForm"));
const SolicitudesVariasForm = lazy(() => import("../../../../components/Admin/Tikets/SolicitudesVariasForm"));
const AsistenciaProgramasForm = lazy(() => import("../../../../components/Admin/Tikets/AsistenciaProgramasForm"));
const CorreoForm = lazy(() => import("../../../../components/Admin/Tikets/CorreoForm"));
const EquipoForm = lazy(() => import("../../../../components/Admin/Tikets/EquipoForm"));


const { Option } = Select;
const { Title } = Typography;

export default function CreateTiketPage() {
    // Estado para controlar qué formulario se muestra
  const [form, setForm] = useState("solicitudes");
  const navigate = useNavigate();

  // Función para cambiar el formulario activo
  const handleMenuClick = (value) => setForm(value);

  // Opciones del select memoizadas para no recrearlas en cada render
  const opcionesFormulario = useMemo(() => [
    { value: "sucursales", label: "🏢 Sucursales" },
    { value: "asistencia", label: "🧩 Asistencia con Programas" },
    { value: "correo", label: "📧 Correo Electrónico" },
    { value: "equipo", label: "💻 Equipo de Cómputo" },
    { value: "solicitudes", label: "📂 Solicitudes Varias" },
  ], []);
  
    // Mapeo de los formularios memoizado para evitar recreación innecesaria
  const formComponents = useMemo(() => ({
    sucursales: <SucursalesForm />,
    solicitudes: <SolicitudesVariasForm />,
    asistencia: <AsistenciaProgramasForm />,
    correo: <CorreoForm />,
    equipo: <EquipoForm />,
  }), []);

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
      {/* Render del formulario seleccionado usando Suspense */}
      <Suspense fallback={<div>Cargando formulario...</div>}>
        {formComponents[form]}
      </Suspense>
    </div>
  );
}
