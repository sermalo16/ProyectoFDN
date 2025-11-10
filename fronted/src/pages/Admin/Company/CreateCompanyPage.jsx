import React, { useState } from "react";
import { Form, Input, Button, Upload, Card, Typography, Divider } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../../assets/empresa.png";
import "./CreateCompanyPage.scss";

const { Title } = Typography;
const { TextArea } = Input;

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(defaultImage);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // base64 para vista previa
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (values) => {
    console.log("Datos guardados:", { ...values, imagen: imageUrl });
    // TODO: Conectar con tu backend para guardar los datos
  };

  return (
    <div className="create-company-page">
      {/* Encabezado */}
      <div className="header-section">
        <div className="left-header">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Regresar
          </Button>
          <Title level={3} className="page-title">
            Crear Empresa
          </Title>
        </div>
      </div>

      <Divider />

      {/* Contenedor del formulario */}
      <Card className="company-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Imagen arriba */}
          <div className="image-upload-container">
            
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
              <Button icon={<UploadOutlined />} className="upload-button">
                Seleccionar imagen
              </Button>
            </Upload>
            
                

          </div>

          {/* Campos del formulario */}
          <Form.Item
            label="Nombre de la empresa"
            name="nombre"
            rules={[{ required: true, message: "Ingrese el nombre de la empresa" }]}
          >
            <Input placeholder="Ejemplo: Fundidora del Norte S.A." />
          </Form.Item>

          <Form.Item
            label="RTN"
            name="rtn"
            rules={[{ required: true, message: "Ingrese el RTN de la empresa" }]}
          >
            <Input placeholder="Ejemplo: 08011999123456" />
          </Form.Item>

          <Form.Item label="Descripción" name="descripcion">
            <TextArea
              rows={4}
              placeholder="Breve descripción de la empresa..."
            />
          </Form.Item>

          {/* Botones */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              Guardar empresa
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
