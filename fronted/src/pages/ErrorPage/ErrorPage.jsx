import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "80px 24px", textAlign: "center" }}>
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que estás buscando no existe."
        extra={
          <Button type="primary" onClick={() => navigate("/admin")}>
            Volver al inicio
          </Button>
        }
      />
    </div>
  );
}
