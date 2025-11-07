// src/pages/TicketDetailPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function TicketDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h2>Detalles del Ticket #{id}</h2>
      <p>Aquí irá la conversación y el desarrollo del ticket.</p>
    </div>
  );
}
