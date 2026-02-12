const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/inventory");
const upload = require("../../middlewares/multer"); // Si estás usando multer para foto

//#region Metodos Get

// Obtener articulos
router.get("/get-inventory", inventoryController.getInventario);

// Obtener articulo por id
router.get("/get-inventory/:idinventario", inventoryController.getInventarioById);

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

//obtener quien dio de baja el inventario
router.get("/get-who-write-off-inventory/:idinventario", inventoryController.getWhoWriteOffInventory);

//obtener quien reparo el inventario
router.get("/get-who-repair-inventory/:idinventario", inventoryController.getWhoRepairInventory);

//obtener inventario en reparacion por categoria
router.get("/get-inventory-in-repair-category/:id_categoria", inventoryController.getInventoryInRepairByCategory);

//buscar inventario por service tag
router.get("/get-inventory-servicetag/:service_tag", inventoryController.getInventoryByServiceTag);

//buscar inventario por numero de serie
router.get("/get-inventory-serie/:numero_serie", inventoryController.getInventoryBySerie);

//buscar inventario por codigo de auditoria
router.get("/get-inventory-codigo-auditoria/:codigo_auditoria", inventoryController.getInventoryByCodigoAuditoria);







//#endregion

//#region Metodos Post
// Crear articulo c
router.post("/post-inventory", inventoryController.createInventario);

//dar de baja inventario
router.post("/post-write-off-inventory/:idinventario/:realizado_por", inventoryController.WriteOffInvetory);

//colocar en reparacion inventario
router.post("/post-repair-inventory/:idinventario/:realizado_por", inventoryController.RepairInventory);

//#endregion

//#region Metodos Put
//Actualizar
router.put("/put-inventory/:idinventario", inventoryController.updateInventario);
//#endregion

//Delete

//#region metodos Delete
//Eliminar
router.delete("/delete-inventory/:idinventario", inventoryController.deleteInventario);
//#endregion 

module.exports = router;
