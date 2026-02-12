import { useEffect, useMemo, useState, useCallback } from "react";
import { notification } from "antd";
import {
  getInventoryExist,
  deleteInventory,
  updateInventory,
  createInventory as createInventoryService,
  getInventoryById
} from "../../services/Inventory";
import { getCategories } from "../../services/categories";

/* =====================
   CONSTANTES
===================== */
const ALL = "Todos";
const SEARCH_DELAY = 400;

/* =====================
   HOOK
===================== */
export function useInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentInventory, setCurrentInventory] = useState(null);


  // filtros
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState(ALL);
  const [filterEstado, setFilterEstado] = useState(ALL);

  /* =====================
     DEBOUNCE SEARCH
  ===================== */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DELAY);

    return () => clearTimeout(handler);
  }, [search]);

  /* =====================
     FETCH INVENTARIO
  ===================== */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventoryExist();
      setInventory(data || []);
    } catch (err) {
      notification.error({
        message: "Error",
        description:
          err?.response?.data?.message || "Error al cargar inventario",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================
     FETCH CATEGORIAS
  ===================== */
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      notification.error({
        message: "Error",
        description:
          err?.response?.data?.message || "Error al cargar categorías",
      });
    }
  }, []);

  /* =====================
  Fetch inventario por ID
===================== */
const fetchInventoryById = useCallback(async (idinventario) => {
  setLoading(true);
  try {
    const data = await getInventoryById(idinventario);

    // 👇 importante
    if (Array.isArray(data)) {
      setCurrentInventory(data[0] || null);
    } else {
      setCurrentInventory(data);
    }

  } catch (err) {
    notification.error({
      message: "Error",
      description:
        err?.response?.data?.message || "Error al obtener el activo",
    });
  } finally {
    setLoading(false);
  }
}, []);



  /* =====================
     CREAR INVENTARIO
  ===================== */
  const createInventory = useCallback(async (data) => {
    try {
      const payload = {
        codigo_auditoria: data.codigo_auditoria,
        idcategoria: data.idcategoria,
        service_tag: data.service_tag,
        nombre_activo: data.nombre_activo,
        descripcion: data.descripcion,
        modelo: data.modelo,
        marca: data.marca,
        estado: "disponible",
        valor: data.valor,
        serie: data.serie,
        
      };

      const res = await createInventoryService(payload);

      notification.success({
        message: "Creado",
        description:
          res?.message || "Activo creado correctamente.",
        placement: "topRight",
      });

      fetchInventory();
    } catch (err) {
      notification.error({
        message: "Error",
        description:
          err.message ||
          "No se pudo crear el activo",
      });
    }
  }, [fetchInventory]);

  /* =====================
     ACTUALIZAR INVENTARIO
  ===================== */
  const updateInventoryItem = useCallback(async (id, data) => {
    try {
      const payload = {
        ...data,
      };

      const res = await updateInventory(id, payload);

      notification.success({
        message: "Actualizado",
        description:
          res?.message || "Activo actualizado correctamente.",
        placement: "topRight",
      });

      fetchInventory();
    } catch (err) {
      notification.error({
        message: "Error",
        description:
          err.message ||
          "No se pudo actualizar el activo",
      });
    }
  }, [fetchInventory]);


  /* =====================
     ELIMINAR (Optimista)
  ===================== */
  const handleDelete = useCallback(async (id) => {
    const previousInventory = inventory;

    // actualización optimista
    setInventory(prev => prev.filter(item => item.idinventario !== id));

    try {
      await deleteInventory(id);

      notification.success({
        message: "Activo eliminado",
      });
    } catch (err) {
      // rollback si falla
      setInventory(previousInventory);

      notification.error({
        message: "Error",
        description:
          err?.response?.data?.message ||
          "Error al eliminar activo",
      });
    }
  }, [inventory]);

  /* =====================
     FILTROS OPTIMIZADOS
  ===================== */
  const filteredInventory = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const hasSearch = q.length > 0;

    return inventory.filter((item) => {
      const nombre = (item.service_tag ?? "").toLowerCase();
      const codigo = (item.codigo_auditoria ?? "").toLowerCase();
      const serie = (item.serie ?? "").toLowerCase();

      const textMatch =
        nombre.includes(q) ||
        codigo.includes(q) ||
        serie.includes(q);

      if (hasSearch) return textMatch;

      const categoriaMatch =
        filterCategoria === ALL ||
        String(item.id_categoria) === String(filterCategoria);

      const estadoMatch =
        filterEstado === ALL ||
        String(item.estado) === String(filterEstado);

      return categoriaMatch && estadoMatch;
    });
  }, [inventory, debouncedSearch, filterCategoria, filterEstado]);

  /* =====================
     RESET FILTROS
  ===================== */
  const resetFilters = useCallback(() => {
    setSearch("");
    setFilterCategoria(ALL);
    setFilterEstado(ALL);
  }, []);

  /* =====================
     INIT
  ===================== */
  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [fetchInventory, fetchCategories]);

  /* =====================
     RETURN
  ===================== */
  return {
    // data
    inventory: filteredInventory,
    categories,
    loading,
    currentInventory,

    // filtros
    search,
    setSearch,
    filterCategoria,
    setFilterCategoria,
    filterEstado,
    setFilterEstado,
    resetFilters,

    // acciones
    createInventory,
    handleDelete,
    refreshInventory: fetchInventory,
    fetchInventoryById,
    updateInventory: updateInventoryItem
  };
}
