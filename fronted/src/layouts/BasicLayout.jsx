// src/layouts/BasicLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function BasicLayout() {
  return (
    <div>
      <header>
        <h1>Página Pública</h1>
        <nav>
          <Link to="/basic/home">Inicio</Link> |{" "}
          <Link to="/basic/contact">Contacto</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
