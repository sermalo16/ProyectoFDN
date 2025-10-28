import React, { use, useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  notification,
  Row,
  Col,
  Select,
  Tabs,
  Checkbox,
  Radio,
  Card,
  Collapse,
  Tag,
  List,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { getInventory } from "../../../services/Inventory";
import { getEmployees } from "../../../services/Employees";
import { getAsigment, createAsigment } from "../../../services/asigment";

const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function AsigmentPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmpleados] = useState([]);
  const [asigment, setAsigment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingAsigment, setEditingAsigment] = useState(null);

  const fetchInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmpleados(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAsigment = async () => {
    setLoading(true);
    try {
      // TODO: conectar con tu servicio real
      const data = await getAsigment();
      setAsigment(data);
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al cargar las asignaciones",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsigment();
    fetchInventory();
    fetchEmployees();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Normalizar datos antes de enviar al backend
      const payload = {
        idempleado: values.idempleado,
        asignado_por: "Sergio Morel", // usuario logueado
        Observaciones: values.observaciones || "",
        mouse: values.mouse ? 1 : 0,
        mochila: values.mochila ? 1 : 0,
        teclado: values.teclado ? 1 : 0,
        equipos: values.equipos.map((eq) => ({
          idinventario: eq.idinventario,
          nuevo_usado: eq.nuevo_usado, // ya viene del formulario
        })),
      };

      const res = await createAsigment(payload);
      console.log(res);
      notification.success({
        message: "Creado",
        description: res.message || "Asiganacion creada correctamente.",
        placement: "topRight",
        duration: 3,
      });

      setIsModalOpen(false);
      fetchAsigment();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al guardar la asignación.",
        placement: "bottomRight",
      });
    }
  };

  const openModal = (item = null) => {
    setEditingAsigment(item);
    setIsModalOpen(true);
    form.resetFields();

    if (item) {
      form.setFieldsValue(item);
    }
  };

  // Columnas base para tabla de Devoluciones
  const returnColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Empleado", dataIndex: "empleado", key: "empleado" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Fecha de Devolución", dataIndex: "fecha", key: "fecha" },
  ];

  const AsignacionesAccordion = ({ asignaciones }) => {
    // Columnas de la tabla de equipos
    const columns = [
      {
        title: "Equipo Asignado",
        dataIndex: "marca",
        key: "marca",
        render: (text, record) => (
          <span>
            <strong>{text}</strong> ({record.marca || "N/A"} -{" "}
            {record.modelo || "N/A"})
          </span>
        ),
      },
      {
        title: "Service Tag",
        dataIndex: "service_tag",
        key: "service_tag",
      },
      {
        title: "Serie",
        dataIndex: "serie",
        key: "serie",
      },
      {
        title: "Categoria",
        dataIndex: "categoria",
        key: "categoria",
      },
      {
        title: "nuevo/usado",
        dataIndex: "nuevo_usado",
        key: "nuevo_usado",
        render: (value) => (value === 1 ? "Nuevo" : "Usado"),
      },
      {
        title: "Valor",
        dataIndex: "valor",
        key: "valor",
        render: (value) => `L ${value}`,
      },
      {
            title: "Acciones",
            key: "acciones",
            fixed: "right",
            render: (_, record) => (
              <Row gutter={[8, 8]}>
                <Col>
                  <Button
                    icon={<EditOutlined />}
                    onClick={null}
                    size="small"
                  >
                    Devolver Activo
                  </Button>
                </Col>
                
              </Row>
            ),
          },
    ];

    return (
      <Collapse accordion>
        {asignaciones.map((item) => (
          <Panel
            key={item.idasignaciones}
            header={`${item.total_registros}# ${item.nombre} ${item.apellido} - ${item.departamento}`}
            extra={
              <Tag color="blue">
                {"Fecha de la asignación: " + item.fecha_asignacion}
              </Tag>
            }
          >
            <p>
              <strong>Asignado por:</strong> {item.asignado_por}
            </p>
            <p>
              <strong>Observaciones:</strong>{" "}
              {item.observaciones || "Sin observaciones"}
            </p>
            <p>
              <strong>Mochila:</strong>{" "}
              {item.mochila === 1 ? "Entregado" : "No entregado"}
            </p>
            <p>
              <strong>Mouse:</strong>{" "}
              {item.mouse === 1 ? "Entregado" : "No entregado"}
            </p>

            <h4>Equipos asignados:</h4>
            {item.equipos?.length > 0 ? (
              <Table
                columns={columns}
                dataSource={item.equipos}
                rowKey={(record) => record.idinventario} // asegúrate que cada equipo tenga un id
                pagination={false}
                bordered
                size="small"
              />
              
            ) : (
              <p>No hay equipos asignados.</p>
            )}
            
          </Panel>
          
        ))}
        
      </Collapse>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Gestión de Asignaciones</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16, marginRight: 20 }}
        onClick={() => openModal()}
      >
        Nueva Asignacion
      </Button>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Asignaciones" key="1">
          <AsignacionesAccordion asignaciones={asigment} />
        </TabPane>
        <TabPane tab="Devoluciones" key="2">
          <Table
            columns={returnColumns}
            dataSource={null}
            rowKey="iddevoluciones"
            pagination={{ pageSize: 5 }}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      {/* Modal para agregar/editar equipos */}
      <Modal
        open={isModalOpen}
        title={
          editingAsigment ? "Editar asignación" : "Agregar nueva asignación"
        }
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingAsigment ? "Actualizar" : "Crear"}
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical">
          {/* Select de empleado */}
          <Form.Item
            name="idempleado"
            label="Empleado"
            rules={[{ required: true, message: "Selecciona un empleado" }]}
          >
            <Select placeholder="Selecciona un empleado">
              {employees.map((emp) => (
                <Select.Option key={emp.idempleados} value={emp.idempleados}>
                  {emp.total_registros +
                    " - " +
                    emp.nombre +
                    " " +
                    emp.apellido +
                    " - " +
                    emp.rrh_codigo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Checkboxes de teclado y mouse */}
          <Form.Item label="Accesorios">
            <Form.Item name="teclado" valuePropName="checked" noStyle>
              <Checkbox>Teclado</Checkbox>
            </Form.Item>
            <Form.Item name="mouse" valuePropName="checked" noStyle>
              <Checkbox style={{ marginLeft: 16 }}>Mouse</Checkbox>
            </Form.Item>
            <Form.Item name="mochila" valuePropName="checked" noStyle>
              <Checkbox style={{ marginLeft: 16 }}>Mochila</Checkbox>
            </Form.Item>
          </Form.Item>

          

          {/* Lista dinámica de equipos */}
          <Form.List name="equipos">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`Equipo ${name + 1}`}
                    extra={<a onClick={() => remove(name)}>Eliminar</a>}
                  >
                    {/* radiobuton que indica si es nuevo o usado */}
                    <Form.Item
                      {...restField}
                      name={[name, "nuevo_usado"]}
                      label="Estado del equipo"
                      rules={[
                        { required: true, message: "Seleccione el estado" },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value={1}>Nuevo</Radio>
                        <Radio value={0}>Usado</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {/* Select que muestra los equipos del inventory */}
                    <Form.Item
                      {...restField}
                      name={[name, "idinventario"]}
                      label="Seleccionar equipo"
                      rules={[
                        { required: true, message: "Selecciona un equipo" },
                      ]}
                    >
                      <Select
                        placeholder="Seleccione un equipo"
                        onChange={(value) => {
                          const equipo = inventory.find(
                            (item) => item.idinventario === value
                          );

                          if (equipo) {
                            // Actualiza SOLO este equipo en la lista
                            const currentEquipos =
                              form.getFieldValue("equipos") || [];
                            currentEquipos[name] = {
                              ...currentEquipos[name],
                              idinventario: equipo.idinventario,
                              service_tag: equipo.service_tag,
                              nombre_activo: equipo.nombre_activo,
                              marca: equipo.marca,
                              modelo: equipo.modelo,
                              serie: equipo.serie,
                              valor: equipo.valor,
                              descripcion: equipo.descripcion,
                            };

                            form.setFieldsValue({
                              equipos: currentEquipos,
                            });
                          }
                        }}
                      >
                        {inventory.map((item) => {
                          const selectedEquipos =
                            form
                              .getFieldValue("equipos")
                              ?.map((eq) => eq?.idinventario) || [];
                          return (
                            <Select.Option
                              key={item.idinventario}
                              value={item.idinventario}
                              disabled={selectedEquipos.includes(
                                item.idinventario
                              )}
                            >
                              {item.codigo_auditoria} - {item.marca} -{" "}
                              {item.modelo} - {item.service_tag}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>

                    {/* Campos distribuidos en dos columnas */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "service_tag"]}
                          label="Service Tag"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "nombre_activo"]}
                          label="Nombre del activo"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "marca"]}
                          label="Marca"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "modelo"]}
                          label="Modelo"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "serie"]}
                          label="Serie"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "valor"]}
                          label="Valor"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Agregar equipo
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Observaciones */}
          <Form.Item name="observaciones" label="Observaciones">
            <Input.TextArea rows={3} placeholder="Escriba observaciones..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
