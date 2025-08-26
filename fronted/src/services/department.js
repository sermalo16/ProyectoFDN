const API_BASE = "http://localhost:3308/api/v1/department";

// Obtener departamentos
export const getDepartments = async () => {
  const res = await fetch(API_BASE + "/get-deparment");

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Error al obtener departamentos");
  }

  return await res.json();
};

// Crear departamento
export const createDepartment = async (data) => {
  try {
    const res = await fetch(API_BASE + "/post-deparment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear el departamento");
    }

    return result;
  } catch (error) {
    console.error("createDepartment error:", error);
    throw error;
  }
};

// Actualizar departamento
export const updateDepartment = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE + "/put-deparment"}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al actualizar el departamento");
    }

    return result;
  } catch (error) {
    console.error("updateDepartment error:", error);
    throw error;
  }
};

// Eliminar departamento
export const deleteDepartment = async (id) => {
  try {
    const res = await fetch(`${API_BASE + "/delete-deparment"}/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al eliminar el departamento");
    }

    return result;
  } catch (error) {
    console.error("deleteDepartment error:", error);
    throw error;
  }
};