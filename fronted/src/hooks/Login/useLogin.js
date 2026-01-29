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
  const { setEmployee } = useAuth();
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
        const employeeData = { id: decoded.idempleados, identidad: decoded.identidad, 
          correo: decoded.Correo, Roles: decoded.Roles,  rrh_codigo: decoded.rrh_codigo, 
          nombre: decoded.nombre, apellido: decoded.apellido, };

        setEmployee(employeeData);

        if (employeeData.Roles === "T") navigate("/admin", { replace: true });
        else navigate("/basic", { replace: true });
      } else {
        notification.error({
          message: "Error de login",
          description: res.message || "Error al conectar con el servidor",
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
