import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import EmployeesPage from "./pages/Configuration/EmployeesPage";
import DepartmentsPage from "./pages/Configuration/DepartmentsPage";
import InventoryPages from "./pages/InventoryManagement/InventoryPages";
import AsigmentPage from "./pages/activities/AsigmentPage";
import CategoryInv from "./pages/InventoryManagement/CategoryPages";
import ProfilePage from "./pages/profile/ProfilePage"

import { isTokenValid } from "./services/auth";

// Nuevas páginas para el nuevo menú
import TiketPage from "./pages/activities/TiketPage";
import ManualsPage from "./pages/activities/ManualsPage";
import ConfigurationPage from "./pages/Configuration/ConfigurationPage";
import CompanyPage from "./pages/Company/CompanyPage";


import ErrorPage from "./pages/ErrorPage/ErrorPage";




function App() {
  const token = localStorage.getItem("accessToken");
  //const isAuth = !!token && isTokenValid(token);
  const isAuth = true;

  // Si el token expiró, lo removemos
  if (!isAuth && token) {
    localStorage.removeItem("token");
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={isAuth ? <AdminPanel /> : <Navigate to="/login" />}
        >
          <Route index element={<TiketPage />} />
          <Route path="tikets" element={<TiketPage />} />
          <Route path="manuals" element={<ManualsPage />} />
          <Route path="asigment" element={<AsigmentPage />} />
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="inventory" element={<InventoryPages />} />
          <Route path="category" element={<CategoryInv />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="company" element={<CompanyPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
