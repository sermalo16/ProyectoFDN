import { useEffect, useMemo, useState } from "react";
import { notification } from "antd";
import { getInventoryExist, getInventoryByDepartment, deleteInventory } from "../../services/Inventory";
import { getCategories } from "../../services/categories";

export function useInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [inventoryAsignado, setInventoryAsignado] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // filtros
  const [search, setSearch] = useState("");
 const [filterCategoria, setFilterCategoria] = useState("Todos");
const [filterEstado, setFilterEstado] = useState("Todos");

  /* =====================
     FETCH DATA
  ===================== */
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventoryExist();
      setInventory(data);
    } catch {
      notification.error({ message: "Error al cargar inventario" });
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryAsignado = async () => {
    try {
      const data = await getInventoryByDepartment();
      setInventoryAsignado(data);
    } catch {
      notification.error({ message: "Error al cargar inventario asignado" });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      notification.error({ message: "Error al cargar categorías" });
    }
  };

  /* =====================
     DELETE
  ===================== */
  const handleDelete = async (id) => {
    try {
      await deleteInventory(id);
      notification.success({ message: "Activo eliminado" });
      fetchInventory();
    } catch {
      notification.error({ message: "Error al eliminar activo" });
    }
  };

  /* =====================
     FILTROS FRONTEND
  ===================== */
 const filteredInventory = useMemo(() => {
  return inventory.filter((item) => {
    const textMatch =
      item.nombre_activo?.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo_auditoria?.toLowerCase().includes(search.toLowerCase()) ||
      item.serie?.toLowerCase().includes(search.toLowerCase());

    const categoriaMatch =
      filterCategoria === "TODOS" ||
      item.id_categoria === filterCategoria;

    const estadoMatch =
      filterEstado === "TODOS" ||
      item.estado === filterEstado;

    return textMatch && categoriaMatch && estadoMatch;
  });
}, [inventory, search, filterCategoria, filterEstado]);


  const resetFilters = () => {
    setSearch("");
    setFilterCategoria(null);
    setFilterEstado(null);
  };

  /* =====================
     INIT
  ===================== */
  useEffect(() => {
    fetchInventory();
    fetchInventoryAsignado();
    fetchCategories();
  }, []);

  return {
    // data
    inventory: filteredInventory,
    inventoryAsignado,
    categories,
    loading,

    // filtros
    search,
    setSearch,
    filterCategoria,
    setFilterCategoria,
    filterEstado,
    setFilterEstado,
    resetFilters,

    // acciones
    handleDelete,
    refreshInventory: fetchInventory
  };
}
