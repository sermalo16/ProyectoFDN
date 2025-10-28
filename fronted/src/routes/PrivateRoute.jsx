// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PrivateRoute({ allowedRoles = [] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Cargando sesión...</p>;

  if (!user) {
    // 🚫 Si no hay usuario, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay roles definidos y el del usuario no está permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.tipo)) {
    // Redirige al layout correcto según su tipo
    const redirectPath = user.tipo === "Tecnico" ? "/admin" : "/basic";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Si todo está bien, muestra las rutas internas
  return <Outlet />;
}
