import React from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Divider,
  Row,
  Col,
  Typography,
  Drawer,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

export default function SolicitudesVarias(props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log("Datos del ticket:", values);
  };

  return (
    <>
      {/* Formulario principal */}
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="ticket-form"
      >
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Estado" name="estado" initialValue="Open">
              <Select defaultValue="Open">
                <Option value="Open">Open</Option>
                <Option value="Closed">Closed</Option>
                <Option value="Pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Urgencia" name="urgencia">
              <Select defaultValue="Media">
                <Option value="Alta">Alta</Option>
                <Option value="Media">Media</Option>
                <Option value="Baja">Baja</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={5} className="section-title">
          Requester Details Section
        </Title>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Nombre del solicitante"
              name="solicitante"
              rules={[{ required: true, message: "Campo obligatorio" }]}
            >
              <Input placeholder="Seleccionar nombre del solicitante" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Técnico"
              name="tecnico"
              initialValue="Sergio Morel"
            >
              <Select>
                <Option value="Sergio Morel">Sergio Morel</Option>
                <Option value="Otro">Otro técnico</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Asunto"
          name="asunto"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Ingrese el asunto del incidente" />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <Input.TextArea
            rows={8}
            placeholder="Describa el incidente con detalle..."
          />
        </Form.Item>

        <Divider />

        <Form.Item label="Archivos adjuntos" name="archivos">
          <Upload.Dragger name="files" multiple>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Arrastre y suelte los archivos aquí o haga clic para subirlos
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Divider />

        <div className="button-group">
          <Button type="primary" htmlType="submit">
            Agregar solicitud
          </Button>
          <Button htmlType="reset">Restablecer</Button>
          <Button danger onClick={() => navigate("/tikets")}>
            Cancelar
          </Button>
        </div>
      </Form>
    </>
  );
}
