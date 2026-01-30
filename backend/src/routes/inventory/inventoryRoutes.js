const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/inventory");
const upload = require("../../middlewares/multer"); // Si estás usando multer para foto

// Crear articulo c
router.post("/post-inventory", inventoryController.createInventario);

// Obtener articulos
router.get("/get-inventory", inventoryController.getInventario);

//ver invantario por categorias
router.get("/get-inventory-category/:id_categoria", inventoryController.getInventarioByCategory);

//obtener inventario asignado general
router.get("/get-inventory-asigned", inventoryController.getInventoryAsigned);

//obtener inventario asignado por categoria
router.get("/get-inventory-asigned-category/:id_categoria", inventoryController.getInventoryAsignedByCategory);

//obtener inventario disponible por categoria
router.get("/get-inventory-available-category/:id_categoria", inventoryController.getInventoryAvailableByCategory);

//obtener inventario asignado por empleado
router.get("/get-inventory-asigned-employee/:id_empleado", inventoryController.getInventoryAsignedByEmployee);

//Obtener inventario existente
router.get("/get-inventory-exist", inventoryController.getInventarioExist);

//Actualizar
router.put("/put-inventory/:idinventario", inventoryController.updateInventario);

//Eliminar
router.delete("/delete-inventory/:idinventario", inventoryController.deleteInventario);


module.exports = router;
