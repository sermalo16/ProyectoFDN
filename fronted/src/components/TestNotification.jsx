import React from "react";
import { Button, notification } from "antd";

export default function TestNotification() {
  const openNotification = () => {
    notification.success({
      message: "Notificación de prueba",
      description: "Si ves esta notificación, funciona correctamente.",
      placement: "topRight",
      duration: 3,
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Probar Notificación
    </Button>
  );
}
