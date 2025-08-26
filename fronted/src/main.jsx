import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'antd/dist/reset.css' // importante para que Ant Design se vea bien
import './index.css' // si tienes estilos globales

// 🔴 Importa el App provider de Ant Design (no te confundas con tu componente)
import { App as AntdApp } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AntdApp> {/* ✅ Este es el proveedor de contextos de antd */}
      <App />
    </AntdApp>
  </React.StrictMode>
);




/*ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)*/