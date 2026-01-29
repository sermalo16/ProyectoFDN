const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employee");
const upload = require("../../middlewares/multer"); // Si estás usando multer para foto

// Crear empleado con posible carga de imagen
router.post("/post-employee", upload.single("foto"), employeeController.createEmployee);

// Obtener empleados
router.get("/get-employee", employeeController.getEmployees);

//obtener empleado por id
router.get("/get-employee/:idempleados/:idempresa", employeeController.getEmployeeById);

//obtener empleado por busqueda
router.get("/search-employee/:nombre/:idempresa", employeeController.searchEmployee);

//obtener empleado por identidad o codigo de RRHH
router.get("/search-employee-identity/:identidad/:idempresa", employeeController.searchEmployeeByIdentity);

//obtener empleado por departamento
router.get("/get-employee-department/:iddepartamentos/:idempresa", employeeController.getEmployeesByDepartment);

//obtener empleado por empresa
router.get("/get-employee-company/:idempresa", employeeController.getEmployeeByCompany);

//Actualizar
router.put("/put-employee/:idempleados", upload.single("foto"), employeeController.updateEmployee);

//Eliminar
router.delete("/delete-employee/:idempleados", employeeController.deleteEmployee);

//activar o desactivar empleado
router.put("/activate-deactivate-employee/:idempleados", employeeController.activateOrDeactivateEmployee);


module.exports = router;
