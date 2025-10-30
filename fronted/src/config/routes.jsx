// src/config/routes.js
import AdminLayout from "../layouts/AdminLayout";
import BasicLayout from "../layouts/BasicLayout";

// Páginas
import Login from "../pages/Login/Login";
import NotFound from "../pages/ErrorPage/ErrorPage";

//Paginas de Admin
import AsigmentPage from "../pages/Admin/activities/AsigmentPage";
import ManualsPage from "../pages/Admin/activities/ManualsPage";
import TiketsPage from "../pages/Admin/activities/TiketPage/TiketPage";
import CreateTiketPage from "../pages/Admin/activities/TiketPage/CreateTiketPage";
import ConfigurationPage from "../pages/Admin/Configuration/ConfigurationPage";
import DepartmentsPage from "../pages/Admin/Configuration/DepartmentsPage";
import EmployeesPage from "../pages/Admin/Configuration/EmployeesPage";
import ProfilesPage from "../pages/Admin/profile/ProfilePage";
import CategoryPages from "../pages/Admin/InventoryManagement/CategoryPages";
import InventoryPages from "../pages/Admin/InventoryManagement/InventoryPages";
import CompanyPage from "../pages/Admin/Company/CompanyPage";

const routes = [
  // ✅ Ruta raíz y login
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // ✅ Rutas de administración (técnicos)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "asigment", element: <AsigmentPage /> },
      { path: "manuals", element: <ManualsPage /> },
      { path: "tikets", element: <TiketsPage /> },
      { path: "createTiket", element: <CreateTiketPage /> },
      { path: "configuration", element: <ConfigurationPage /> },
      { path: "departments", element: <DepartmentsPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "profile", element: <ProfilesPage /> },
      { path: "category", element: <CategoryPages /> },
      { path: "inventory", element: <InventoryPages /> },
      { path: "company", element: <CompanyPage /> },
      // Página no encontrada dentro del admin
      { path: "*", element: <NotFound /> },
    ],
  },

  // ✅ Rutas de solicitantes
  {
    path: "/basic",
    element: <BasicLayout />,
    children: [
      // Aquí agregarás las páginas del portal básico
      { path: "*", element: <NotFound /> },
    ],
  },

  // 🚨 Catch-all general (debe ir al final SIEMPRE)
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
