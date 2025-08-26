import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  ApartmentOutlined,
  UserOutlined,
  SettingOutlined,
  DeploymentUnitOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ConfigurationPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Configuraciones de instancia */}
        <Col xs={24} md={8}>
          <Card bordered hoverable>
            <Title level={4} style={{ color: "#1677ff" }}>
              <ApartmentOutlined style={{ fontSize: 24, marginRight: 8 }} />
              Configuraciones de instancia
            </Title>
            <div>
              <Link to="/admin/company">Empresa</Link> | {" "}
              <Link to="/admin/departments">Departamentos</Link>
            </div>
          </Card>
        </Col>

        {/* Usuarios y permisos */}
        <Col xs={24} md={8}>
          <Card bordered hoverable>
            <Title level={4} style={{ color: "#1677ff" }}>
              <UserOutlined style={{ fontSize: 24, marginRight: 8 }} />
              Usuarios y permisos
            </Title>
            <div>
              <Link to="/admin/employees">Empleados</Link> | {" "}
              <Link to="/admin/employees">Permisos</Link>
            </div>
          </Card>
        </Col>

        {/* Equipos y recursos */}
        <Col xs={24} md={8}>
          <Card bordered hoverable>
            <Title level={4} style={{ color: "#1677ff" }}>
              <ToolOutlined style={{ fontSize: 24, marginRight: 8 }} />
              Equipos y recursos
            </Title>
            <div>
              <Link to="/admin/inventory">Inventario</Link> | {" "}
              <Link to="/admin/asigment">Asignaciones</Link> | {" "}
              <Link to="/admin/Category">Categorías</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConfigurationPage;
