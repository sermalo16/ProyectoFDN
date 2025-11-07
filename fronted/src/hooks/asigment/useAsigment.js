import { useState, useEffect } from "react";
import { Form, notification } from "antd";
import { getInventory } from "../../services/Inventory";
import { getEmployees } from "../../services/employees";
import { getAsigment, createAsigment } from "../../services/asigment";

export const useAsigmentManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [asigment, setAsigment] = useState([]);

  // ===========================
  // 📦 Fetchers
  // ===========================
  const fetchInventory = async () => {
    try {
      const data = await getInventory();
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

  // ===========================
  // 🔁 Inicialización
  // ===========================
  useEffect(() => {
    fetchAsigment();
    fetchInventory();
    fetchEmployees();
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
    fetchInventory,
    fetchEmployees,
    fetchAsigment,
    createNewAsigment,
  };
};