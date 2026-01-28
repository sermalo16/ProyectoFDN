const express = require("express");
const router = express.Router();
const companyController = require("../../controllers/company");



// Obtener empresas
router.get("/get-company", companyController.getcompany);

// Obtener empresa por ID
router.get("/get-company/:id", companyController.getcompanyById);

// Crear empresa
router.post("/create-company", companyController.createcompany);

// Actualizar empresa
router.put("/update-company/:id", companyController.updatecompany);

// Eliminar empresa
router.delete("/delete-company/:id", companyController.deletecompany);



module.exports = router;