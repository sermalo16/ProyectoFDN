const express = require("express");
const router = express.Router();
const deparmentController = require("../../controllers/deparment");

/* ===============================
   CRUD DEPARTAMENTOS
================================*/

// Crear Departamento
router.post("/post-deparment", deparmentController.createDepartment);

// Obtener todos los Departamentos
router.get("/get-deparment", deparmentController.getdeparment);

// Obtener Departamentos por Empresa
router.get(
  "/get-deparment-company/:idEmpresa",
  deparmentController.getDepartmentsByCompany
);

// Actualizar Departamento
router.put(
  "/put-deparment/:iddepartamentos",
  deparmentController.updateDepartment
);

// Eliminar Departamento
router.delete(
  "/delete-deparment/:iddepartamentos",
  deparmentController.deleteDepartment
);

/* ===============================
   RELACIÓN EMPRESA - DEPARTAMENTO
================================*/

// Asignar Departamento a Empresa
router.post(
  "/post-company-deparment",
  deparmentController.addDepartmentToCompany
);

// Quitar Departamento de Empresa
router.delete(
  "/delete-company-deparment/:id_empresa/:id_departamento",
  deparmentController.removeDepartmentFromCompany
);

module.exports = router;
