const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryInv");

// Cargar tabla Departamento
router.post("/post-category", categoryController.createCategory);

// Obtener Departamento
router.get("/get-category", categoryController.getCategories);

// Actualizar Departamento
router.put("/put-category/:idcategoria", categoryController.updateCategory);

// Eliminar Departamento
router.delete("/delete-category/:idcategoria", categoryController.deleteCategory);

module.exports = router;
