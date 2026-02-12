import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useInventoryPage } from "../../../hooks/Inventory/useInventoryPage";

const { Option } = Select;
const { TextArea } = Input;

export default function UpdateInventoryPage() {
  const navigate = useNavigate();
  const { idinventario } = useParams();
  const {
    fetchInventoryById,
    currentInventory,
    updateInventory,
    loading,
    categories
    
  } = useInventoryPage();

  const [form] = Form.useForm();  

  /* =====================
     CARGAR ACTIVO
  ===================== */
  useEffect(() => {
    if (idinventario) {
      fetchInventoryById(idinventario);
    }
  }, [idinventario, fetchInventoryById]);

  console.log(currentInventory);
  

  /* =====================
     SETEAR FORM CUANDO CARGA
  ===================== */
  useEffect(() => {
    if (currentInventory) {
      form.setFieldsValue({
        codigo_auditoria: currentInventory.codigo_auditoria,
        idcategoria: currentInventory.id_categoria,
        service_tag: currentInventory.service_tag,
        nombre_activo: currentInventory.nombre_activo,
        descripcion: currentInventory.descripcion,
        marca: currentInventory.marca,
        modelo: currentInventory.modelo,
        serie: currentInventory.serie,
        valor: currentInventory.valor,
        estado: currentInventory.estado,
      });
    }
  }, [currentInventory, form]);

  /* =====================
     SUBMIT
  ===================== */
  const onFinish = async (values) => {
    await updateInventory(idinventario, values);
    navigate(-1);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Regresar
      </Button>

      <Card
        title="Actualizar Activo"
        bordered={false}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <Spin spinning={loading}>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Código de Auditoría"
                  name="codigo_auditoria"
                  rules={[{ required: true }]}
                >
                  <Input />
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
              rules={[{ required: true }]}
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
                  rules={[{ required: true }]}
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
                Actualizar Activo
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
