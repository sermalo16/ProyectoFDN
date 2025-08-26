// src/hooks/useAuthCheck.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, isTokenValid, removeToken } from "../services/auth";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
      removeToken();
      navigate("/login");
    }
  }, []);
};

export default useAuthCheck;
