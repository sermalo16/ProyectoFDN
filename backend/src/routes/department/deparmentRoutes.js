const express = require("express");
const router = express.Router();
const deparmentController = require("../../controllers/deparment");

// Cargar tabla Departamento
router.post("/post-deparment",deparmentController.createDepartment );

// Obtener Departamento
router.get("/get-deparment", deparmentController.getdeparment);

// Actualizar Departamento
router.put("/put-deparment/:iddepartamentos", deparmentController.updateDepartment);

// Eliminar Departamento
router.delete("/delete-deparment/:iddepartamentos", deparmentController.deleteDepartment);

module.exports = router;
