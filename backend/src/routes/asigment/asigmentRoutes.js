const express = require("express");
const router = express.Router();
const asigmentController = require("../../controllers/asigment");
const auth = require("../../middlewares/auth");

// Cargar tabla Departamento
router.post("/post-asigment", auth, asigmentController.createAsigment);

// Obtener Departamento
router.get("/get-asigment", asigmentController.getAssignments );

// Actualizar Departamento
router.delete("/delete-asigment/:idasignaciones", asigmentController.deleteAsigment);

// Eliminar Departamento
router.delete("/delete-deparment/:iddepartamentos", );

module.exports = router;
