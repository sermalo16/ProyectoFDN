import React from "react";
import { Form, Input, InputNumber, Select, Button, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useInventoryPage } from "../../../hooks/Inventory/useInventoryPage";

const { Option } = Select;
const { TextArea } = Input;

export default function CreateInventoryPage() {
  const navigate = useNavigate();
  const { categories, createInventory } = useInventoryPage();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
        console.log(values);
        
      await createInventory(values);
      form.resetFields();
      //navigate(-1); // regresar a la página anterior
    } catch (error) {
      console.error("Error al crear inventario:", error);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Botón regresar */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Regresar
      </Button>

      <Card
        title="Crear Nuevo Activo"
        bordered={false}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ estado: "disponible" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Código de Auditoría"
                name="codigo_auditoria"
                rules={[{ required: true, message: "Ingrese el código" }]}
              >
                <Input placeholder="Ej: Com00212" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Categoría"
                name="idcategoria"
                rules={[{ required: true, message: "Seleccione categoría" }]}
              >
                <Select placeholder="Seleccione categoría">
                  {categories.map((category) => (
                    <Option key={category.idcategoria} value={category.idcategoria}>
                      {category.categoria}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Service Tag" name="service_tag">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Serie" name="serie">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Marca" name="marca">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Modelo" name="modelo">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Nombre del Activo"
            name="nombre_activo"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Descripción" name="descripcion">
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Valor (Lempiras)"
                name="valor"
                rules={[{ required: true, message: "Ingrese el valor" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Estado" name="estado">
                <Select>
                  <Option value="disponible">Disponible</Option>
                  <Option value="asignado">Asignado</Option>
                  <Option value="reparacion">Reparación</Option>
                  <Option value="defectuoso">Defectuoso</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Guardar Activo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
