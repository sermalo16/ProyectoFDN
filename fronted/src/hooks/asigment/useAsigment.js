import { useState, useEffect, useCallback } from "react";
import { Form, notification } from "antd";
import { getAvailableInventory } from "../../services/Inventory";
import { getEmployees } from "../../services/employees";
import { getAsigment, createAsigment } from "../../services/asigment";
import { getCategories } from "../../services/categories";

export const useAsigmentManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [asigment, setAsigment] = useState([]);
  const [categories, setCategories] = useState([]);

  // ===========================
  // 📦 Fetchers
  // ===========================
  const fetchInventory = async () => {
    try {
      const data = await getAvailableInventory();
      setInventory(data);
    } catch (err) {
      console.error("Error al cargar inventario:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  const fetchAsigment = async () => {
    setLoading(true);
    try {
      const data = await getAsigment();
      setAsigment(data);
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al cargar las asignaciones",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =====================
       FETCH CATEGORIAS
    ===================== */
    const fetchCategories = useCallback(async () => {
      try {
        const data = await getCategories();
        console.log(data);
        
        setCategories(data || []);
      } catch (err) {
        notification.error({
          message: "Error",
          description:
            err?.response?.data?.message || "Error al cargar categorías",
        });
      }
    }, []);

  // ===========================
  // 🔁 Inicialización
  // ===========================
  useEffect(() => {
    fetchAsigment();
    fetchInventory();
    fetchEmployees();
    fetchCategories();
  }, []);

  // ===========================
  // ✅ Crear Asignación
  // ===========================
  const createNewAsigment = async (values) => {
    try {
      const payload = {
        idempleado: values.idempleado,
        asignado_por: "Sergio Morel", // puedes reemplazarlo con usuario logueado
        Observaciones: values.observaciones || "",
        mouse: values.mouse ? 1 : 0,
        mochila: values.mochila ? 1 : 0,
        teclado: values.teclado ? 1 : 0,
        equipos: values.equipos.map((eq) => ({
          idinventario: eq.idinventario,
          nuevo_usado: eq.nuevo_usado,
        })),
      };

      const res = await createAsigment(payload);

      notification.success({
        message: "Creado",
        description: res.message || "Asignación creada correctamente.",
        placement: "topRight",
        duration: 3,
      });

      fetchAsigment(); // refrescar lista
      return res;
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Error al guardar la asignación.",
        placement: "bottomRight",
      });
      throw err;
    }
  };

  // ===========================
  // 🔄 Retorno del hook
  // ===========================
  return {
    inventory,
    employees,
    asigment,
    loading,
    categories,
    fetchInventory,
    fetchEmployees,
    fetchAsigment,
    createNewAsigment,
    fetchCategories
  };
};