import React, { useState } from "react";
import { Form, Input, Button, Tabs, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/login";
import logo from "../assets/logo-white.png";
import "../styles/Login.scss";
import { saveToken, autoLogout } from "../services/auth";

const { TabPane } = Tabs;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg(""); // Limpiar error anterior

    try {
      const res = await loginApi(values);

      if (res.success) {
        saveToken(res.accessToken);
        autoLogout(); // Configura logout automático
        navigate("/admin");
        window.location.reload(); // 👈 importante
      } else {
        setErrorMsg("Credenciales inválidas");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMsg("Correo o contraseña incorrectos");
      } else {
        setErrorMsg("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="login-box">
          <Tabs defaultActiveKey="1" type="card" centered>
            <Tabs.TabPane tab="Iniciar sesión" key="1">
              {/* Mostrar alerta si hay error */}
              {errorMsg && (
                <Alert
                  message={errorMsg}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setErrorMsg("")}
                  style={{ marginBottom: "16px" }}
                />
              )}

              <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item
                  name="user"
                  label="Usuario/Correo"
                  rules={[
                    { required: true, message: "Ingresa tu correo / Usuario" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[{ required: true, message: "Ingresa tu contraseña" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Entrar
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
