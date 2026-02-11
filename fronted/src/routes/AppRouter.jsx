// src/routes/AppRouter.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthProvider";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import BasicLayout from "../layouts/BasicLayout";

// Páginas
import Login from "../pages/Login/Login";
import NotFound from "../pages/ErrorPage/ErrorPage";

//Paginas de Admin
import AsigmentPage from "../pages/Admin/activities/Asigment/AsigmentPage";
import CreateAsigment from "../pages/Admin/activities/Asigment/CreateAsigment";
import ManualsPage from "../pages/Admin/activities/ManualsPage";
import TiketsPage from "../pages/Admin/activities/TiketPage/TiketPage";
import CreateTiketPage from "../pages/Admin/activities/TiketPage/CreateTiketPage";
import ConfigurationPage from "../pages/Admin/Configuration/ConfigurationPage";
import DepartmentsPage from "../pages/Admin/Configuration/DepartmentsPage";
import EmployeesPage from "../pages/Admin/Configuration/EmployeesPage";
import AccessPage from "../pages/Admin/Configuration/AccessPage";
import ProfilesPage from "../pages/Admin/profile/ProfilePage";
import CategoryPages from "../pages/Admin/InventoryManagement/CategoryPages";
import InventoryPages from "../pages/Admin/InventoryManagement/InventoryPages";
import CreateInventoryPage from "../pages/Admin/InventoryManagement/CreateInventoryPage";
import CompanyPage from "../pages/Admin/Company/CompanyPage";
import CreateCompanyPage from "../pages/Admin/Company/CreateCompanyPage";

import LoadingPage from "../pages/LoadingPAge/LoadingPage";
function SessionWatcher() {
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // 🔁 Detecta eliminación de localStorage (token borrado manualmente)
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) logout();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout, location]);

  return null;
}

export default function AppRouter() {
  const { employee, isLoading } = useAuth();
   

  if (isLoading) return <LoadingPage message="Verificando sesión del usuario..." />;

  return (
    <BrowserRouter>
      <SessionWatcher />
      <Routes>
        {/* 🔒 Login redirige según rol si ya hay sesión */}
        <Route
          path="/"
          element={
            employee ? (
              <Navigate
                to={employee.Roles === "T" ? "/admin" : "/basic"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* ✅ Agrega esta ruta */}
        <Route
          path="/login"
          element={
            employee ? (
              <Navigate
                to={employee.Roles === "T" ? "/admin" : "/basic"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Portal Solicitante */}
        <Route element={<PrivateRoute allowedRoles={["S"]} />}>
          <Route path="/basic" element={<BasicLayout />}>
            <Route index element={<p>Bienvenido Solicitante</p>} />
          </Route>
        </Route>

        {/* Portal Técnico */}
        <Route element={<PrivateRoute allowedRoles={["T"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<TiketsPage />} />
            <Route path="manuals" element={<ManualsPage />} />
            <Route path="tikets" element={<TiketsPage />} />
            <Route path="tikets/createTiket" element={<CreateTiketPage />} />
            <Route path="asigment" element={<AsigmentPage />} />
            <Route path="createAsigment" element={<CreateAsigment />} />
            <Route path="configuration" element={<ConfigurationPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="access" element={<AccessPage />} />
            <Route path="profile" element={<ProfilesPage />} />
            <Route path="category" element={<CategoryPages />} />
            <Route path="inventory" element={<InventoryPages />} />
            <Route path="inventory/createInventory" element={<CreateInventoryPage />} />
            <Route path="company" element={<CompanyPage />} />
            <Route path="createCompany" element={<CreateCompanyPage />} />
          </Route>
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
