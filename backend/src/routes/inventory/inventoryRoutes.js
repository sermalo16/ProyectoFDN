const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/inventory");
const upload = require("../../middlewares/multer"); // Si estás usando multer para foto

// Crear articulo c
router.post("/post-inventory", inventoryController.createInventario);

// Obtener articulos
router.get("/get-inventory", inventoryController.getInventario);

//Actualizar
router.put("/put-inventory/:idinventario", inventoryController.updateInventario);

//Eliminar
router.delete("/delete-inventory/:idinventario", inventoryController.deleteInventario);


module.exports = router;
