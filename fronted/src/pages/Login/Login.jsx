import React from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  Checkbox,
  Typography,
  Space,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import  {useLogin}  from "../../hooks/Login/useLogin";

import "./Login.scss";

const { Title, Text } = Typography;

export default function Login() {
  const { onFinish, loading, errorMsg } = useLogin();

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2}>Sistema Informatica</Title>
        <Text>Bienvenido al sistema, favor inicia sesión</Text>

        <Tabs defaultActiveKey="account" centered style={{ marginTop: 20 }}>
          <Tabs.TabPane tab="Ingrese sus credenciales" key="account">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              style={{ marginTop: 20 }}
              autoComplete="on"
            >
              <Form.Item
              id="user"
                name="user"
                autoComplete="user"
                rules={[{ required: true, message: "Ingrese su correo" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Correo electrónico"
                />
              </Form.Item>

              <Form.Item
              id="password"
                name="password"
                autoComplete="password"
                rules={[{ required: true, message: "Ingresa tu clave!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                />
              </Form.Item>

              <Form.Item>
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Checkbox>Remember me</Checkbox>
                  <a href="#">Forgot Password?</a>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Ingresar
                </Button>
              </Form.Item>

              {errorMsg && (
                <Text type="danger" style={{ display: "block", marginTop: 10 }}>
                  {errorMsg}
                </Text>
              )}
            </Form>
          </Tabs.TabPane>
        </Tabs>

        <footer style={{ marginTop: 40, textAlign: "center" }}>
          <Text>Realbits © Powered by Ant Design</Text>
        </footer>
      </div>
    </div>
  );
}
