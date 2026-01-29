// src/context/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getAccessTokenApi,
  getRefreshTokenApi,
  refreshAccessTokenApi,
  autoLogout,
} from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserLogin();

    // 🔁 Verificar token cada minuto
    const interval = setInterval(() => checkUserLogin(), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkUserLogin = async () => {
    try {
      const accessToken = getAccessTokenApi();
      if (!accessToken) return handleLogout();

      const decoded = jwtDecode(accessToken);
      if (isTokenExpired(decoded)) return handleLogout();

      setEmployee(decoded);
    } catch {
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const isTokenExpired = (decoded) => {
    if (!decoded?.exp) return true;
    return decoded.exp < Date.now() / 1000;
  };

  const handleLogout = () => {
    autoLogout();
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ employee, setEmployee, logout: handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
