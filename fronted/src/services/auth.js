// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const autoLogout = () => {
  const token = getToken();
  if (!token) return;

  try {
    const { exp } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeLeft = (exp - currentTime) * 1000;

    if (timeLeft > 0) {
      setTimeout(() => {
        removeToken();
        window.location.href = "/login";
      }, timeLeft);
    } else {
      removeToken();
      window.location.href = "/login";
    }
  } catch (err) {
    removeToken();
    window.location.href = "/login";
  }
};
