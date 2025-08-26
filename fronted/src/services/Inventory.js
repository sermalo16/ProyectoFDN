const API_BASE = "http://localhost:3308/api/v1/inventory";

// Obtener departamentos
export const getInventory = async () => {
  const res = await fetch(API_BASE + "/get-inventory");

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Error al obtener el inventario");
  }

  return await res.json();
};

// Crear departamento
export const createInventory = async (data) => {
  try {
    const res = await fetch(API_BASE + "/post-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear el activo");
    }

    return result;
  } catch (error) {
    console.error("createInventory error:", error);
    throw error;
  }
};

// Actualizar departamento
export const updateInventory = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE + "/put-inventory"}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al actualizar el activo");
    }

    return result;
  } catch (error) {
    console.error("updateInventory error:", error);
    throw error;
  }
};

// Eliminar departamento
export const deleteInventory = async (id) => {
  try {
    const res = await fetch(`${API_BASE + "/delete-inventory"}/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al eliminar el activo");
    }

    return result;
  } catch (error) {
    console.error("deleteInventory error:", error);
    throw error;
  }
};