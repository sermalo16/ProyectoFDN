// src/hooks/Login/useLogin.js
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginApi } from "../../services/login";
import { saveToken } from "../../services/auth";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthProvider";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginApi(values);

      if (res.success && res.accessToken) {
        saveToken(res.accessToken);

        const decoded = jwtDecode(res.accessToken);
        const userData = { id: decoded.id, tipo: decoded.tipo, name: decoded.name };

        setUser(userData);

        if (userData.tipo === "Tecnico") navigate("/admin", { replace: true });
        else navigate("/basic", { replace: true });
      } else {
        notification.error({
          message: "Error de login",
          description: "Credenciales inválidas",
          placement: "bottomRight",
        });
      }
    } catch (err) {
      setErrorMsg("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return { onFinish, loading, errorMsg };
};
