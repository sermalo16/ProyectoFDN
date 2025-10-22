const API_BASE = "http://localhost:3308/api/v1/asigment/";

// Obtener Inventario
export const getAsigment = async () => {
  const res = await fetch(API_BASE + "/get-asigment");

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Error al obtener las asignaciones");
  }

  return await res.json();
};

// Crear empleado
export const createAsigment = async (data) => {
  try {
    const res = await fetch(API_BASE + "/post-asigment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear la asignacion");
    }

    return result;
  } catch (error) {
    console.error("createAsigment error:", error);
    throw error;
  }
};