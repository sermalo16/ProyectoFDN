const API_BASE = "http://localhost:3308/api/v1/category";

// Obtener categorías
export const getCategories = async () => {
  const res = await fetch(API_BASE + "/get-category");

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Error al obtener categorías");
  }

  return await res.json();
};

// Crear categoría
export const createCategory = async (data) => {
  try {
    const res = await fetch(API_BASE + "/post-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear la categoría");
    }

    return result;
  } catch (error) {
    console.error("createCategory error:", error);
    throw error;
  }
};

// Actualizar categoría
export const updateCategory = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE + "/put-category"}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al actualizar la categoría");
    }

    return result;
  } catch (error) {
    console.error("updateCategory error:", error);
    throw error;
  }
};

// Eliminar categoría
export const deleteCategory = async (id) => {
  try {
    const res = await fetch(`${API_BASE + "/delete-category"}/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al eliminar la categoría");
    }

    return result;
  } catch (error) {
    console.error("deleteCategory error:", error);
    throw error;
  }
};
