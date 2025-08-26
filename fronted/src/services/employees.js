const API_BASE = "http://localhost:3308/api/v1/employee";

// Obtener empleados
export const getEmployees = async () => {
  try {
    const res = await fetch(API_BASE + "/get-employee");

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al obtener empleados");
    }

    return result;
  } catch (error) {
    console.error("getEmployees error:", error);
    throw error;
  }
};

// Crear empleado
export const createEmployee = async (formData) => {
  try {
    const res = await fetch(API_BASE + "/post-employee", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear empleado");
    }

    return result;
  } catch (error) {
    console.error("createEmployee error:", error);
    throw error;
  }
};

// Actualizar empleado
export const updateEmployee = async (id, formData) => {
  try {
    const res = await fetch(`${API_BASE + "/put-employee"}/${id}`, {
      method: "PUT",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al actualizar empleado");
    }

    return result;
  } catch (error) {
    console.error("updateEmployee error:", error);
    throw error;
  }
};

// Eliminar empleado
export const deleteEmployee = async (id) => {
  try {
    const res = await fetch(`${API_BASE + "/delete-employee"}/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al eliminar empleado");
    }

    return result;
  } catch (error) {
    console.error("deleteEmployee error:", error);
    throw error;
  }
};
