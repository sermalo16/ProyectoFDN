// src/config/routes.js
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
      {path: "createAsigment", element: <CreateAsigment /> },
      { path: "manuals", element: <ManualsPage /> },
      { path: "tikets", element: <TiketsPage /> },
      { path: "tikets/createTiket", element: <CreateTiketPage /> },
      { path: "configuration", element: <ConfigurationPage /> },
      { path: "departments", element: <DepartmentsPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "access", element: <AccessPage /> },
      { path: "profile", element: <ProfilesPage /> },
      { path: "category", element: <CategoryPages /> },
      { path: "inventory", element: <InventoryPages /> },
      { path: "inventory/createInventory", element: <CreateInventoryPage /> },
      { path: "company", element: <CompanyPage /> },
      { path: "createCompany", element: <CreateCompanyPage /> },
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
