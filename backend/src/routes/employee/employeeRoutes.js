const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employee");
const upload = require("../../middlewares/multer"); // Si estás usando multer para foto

// Crear empleado con posible carga de imagen
router.post("/post-employee", upload.single("foto"), employeeController.createEmployee);

// Obtener empleados
router.get("/get-employee", employeeController.getEmployees);

// Obtener empleados Tecnicos
router.get("/get-employee/technicians", employeeController.getTechnicians);

// Obtener empleados Solicitante
router.get("/get-employee/applicants", employeeController.getapplicants);

//Actualizar
router.put("/put-employee/:idusuarios", upload.single("foto"), employeeController.updateEmployee);

//Eliminar
router.delete("/delete-employee/:idusuarios", employeeController.deleteEmployee);


module.exports = router;
