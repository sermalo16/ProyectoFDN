const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

//obtener empleados
function getEmployees(req, res) {
  const sql = `
    SELECT 
      e.*,
      d.departamento,
      em.nombreEmpresa AS empresa
    FROM empleados e
    INNER JOIN empresa_departamento ed 
      ON e.id_empresa_departamento = id
    INNER JOIN departamentos d 
      ON ed.id_departamento = d.iddepartamentos
    INNER JOIN empresas em 
      ON ed.id_empresa = em.idEmpresa
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener empleados" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const data = results.map(e => ({
      ...e,
      foto: e.foto
        ? `${baseUrl}/uploads/empleados/${e.foto}`
        : null
    }));

    res.json(data);
  });
}


//obtener empleados por ID
function getEmployeeById(req, res) {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM empleados
    WHERE idempleados = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", err });
    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.json(results[0]);
  });
}

//crear empleado
function createEmployee(req, res) {
  const {
    id_empresa_departamento,
    identidad,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    fecha_ingreso,
    telefono,
    rrh_codigo,
    correo,
    clave,
    roles
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  // 🔹 Validación centralizada
  const requiredFields = {
    correo: "El correo es obligatorio",
    clave: "La clave es obligatoria",
    id_empresa_departamento: "El departamento es obligatorio",
    identidad: "El DNI es obligatorio",
    nombre: "El nombre es obligatorio",
    apellido: "El apellido es obligatorio",
    puesto: "El puesto es obligatorio",
    fecha_nacimiento: "La fecha de nacimiento es obligatoria",
    fecha_ingreso: "La fecha de ingreso es obligatoria",
    rrh_codigo: "El código RRH es obligatorio",
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      return res.status(400).json({ message });
    }
  }

  // 🔹 Encriptar clave
  bcrypt.hash(clave, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error encriptando clave" });
    }

    const sql = `
      INSERT INTO empleados (
        id_empresa_departamento,
        identidad,
        nombre,
        apellido,
        puesto,
        fecha_nacimiento,
        fecha_ingreso,
        foto,
        telefono,
        rrh_codigo,
        correo,
        clave,
        roles,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const values = [
      id_empresa_departamento,
      identidad,
      nombre,
      apellido,
      puesto,
      fecha_nacimiento,
      fecha_ingreso,
      foto,
      telefono,
      rrh_codigo,
      correo.toLowerCase(),
      hash,
      roles
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          let message = "Registro duplicado.";

          if (err.sqlMessage.includes("identidad")) {
            message = "Ya existe un empleado con la misma identidad.";
          } else if (err.sqlMessage.includes("rrh_codigo")) {
            message = "Ya existe un empleado con el mismo código RRH.";
          }else if (err.sqlMessage.includes("correo")) {
            message = "Ya existe un empleado con el mismo correo.";
          }

          return res.status(400).send({ message });
        }

        return res.status(500).json({
          message: "Error al crear empleado",
          error: err
        });
      }

      return res.status(201).json({
        message: "Empleado creado exitosamente",
        id: result.insertId
      });
    });
  });
}

//actualizar empleado
function updateEmployee(req, res) {
  const { idempleados } = req.params;
 
log(idempleados);
  const {
    id_empresa_departamento,
    identidad,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    fecha_ingreso,
    telefono,
    rrh_codigo,
    correo,
    clave,
    roles
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  // 🔹 Validaciones obligatorias
   const requiredFields = {
    correo: "El correo es obligatorio",
    clave: "La clave es obligatoria",
    id_empresa_departamento: "El departamento es obligatorio",
    identidad: "El DNI es obligatorio",
    nombre: "El nombre es obligatorio",
    apellido: "El apellido es obligatorio",
    puesto: "El puesto es obligatorio",
    fecha_nacimiento: "La fecha de nacimiento es obligatoria",
    fecha_ingreso: "La fecha de ingreso es obligatoria",
    rrh_codigo: "El código RRH es obligatorio",
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      return res.status(400).json({ message });
    }
  }

  const emailNormalized = correo.trim().toLowerCase();

  // 🔹 Construcción dinámica del UPDATE
  let sql = `
    UPDATE empleados SET
      id_empresa_departamento = ?,
      identidad = ?,
      nombre = ?,
      apellido = ?,
      puesto = ?,
      fecha_nacimiento = ?,
      fecha_ingreso = ?,
      telefono = ?,
      rrh_codigo = ?,
      correo = ?,
      roles = ?
  `;

  const values = [
    id_empresa_departamento,
    identidad,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    fecha_ingreso,
    telefono,
    rrh_codigo,
    emailNormalized,
    roles
  ];

  // 🔹 Foto opcional
  if (foto) {
    sql += `, foto = ?`;
    values.push(foto);
  }

  // 🔹 Clave opcional
  const finalizeUpdate = (passwordHash = null) => {
    if (passwordHash) {
      sql += `, clave = ?`;
      values.push(passwordHash);
    }

    sql += ` WHERE idempleados = ?`;
    values.push(idempleados);
    log(idempleados);
    connection.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          let message = "Registro duplicado.";

          if (err.message.includes("identidad_UNIQUE")) {
            message = "Ya existe un empleado con la misma identidad.";
          } else if (err.message.includes("rrh_codigo_UNIQUE")) {
            message = "Ya existe un empleado con el mismo código RRH.";
          } else if (err.message.includes("Correo_UNIQUE")) {
            message = "Ya existe un empleado con el mismo correo.";
          }

          return res.status(409).json({ message });
        }

        return res.status(500).json({
          message: "Error al actualizar empleado",
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      return res.status(200).json({
        message: "Empleado actualizado correctamente"
      });
    });
  };

  // 🔹 Si viene clave → encriptar
  if (clave) {
    bcrypt.hash(clave, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Error encriptando clave" });
      }
      finalizeUpdate(hash);
    });
  } else {
    finalizeUpdate();
  }
}

//eliminar empleado
function deleteEmployee(req, res) {
  const { idempleados } = req.params;  
  // 🔹 Verificar si existe
  connection.query(
    "SELECT idempleados FROM empleados WHERE idempleados = ?",
    [idempleados],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al verificar empleado" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      // 🔹 Eliminar
      connection.query(
        "DELETE FROM empleados WHERE idempleados = ?",
        [idempleados],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Error al eliminar empleado" });
          }

          return res.status(200).json({
            message: "Empleado eliminado correctamente"
          });
        }
      );
    }
  );
}

//activar o desactivar empleado
function activateOrDeactivateEmployee(req, res) {
  const { idempleados } = req.params;
  const { estado } = req.body;

  if (estado !== "Activo" && estado !== "Inactivo") {
    return res.status(400).json({ message: "El estado debe ser 'Activo' o 'Inactivo'" });
  }

  connection.query(
    "UPDATE empleados SET estado = ? WHERE idempleados = ?",
    [estado, idempleados],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al actualizar estado del empleado", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      if (estado === "Activo") {
        return res.status(200).json({
          message: "Empleado activado correctamente"
        });
      }      
      return res.status(200).json({
        message: "Empleado desactivado correctamente"
      });
    }
  );
}

//obtener empleado por ID
function getEmployeeById(req, res) {
  const { idempleados, idempresa } = req.params;
  const sql = `
    select e.* from empleados e join 
empresa_departamento ed on e.id_empresa_departamento = ed.id join
 empresas em on ed.id_empresa = em.idEmpresa join departamentos d on ed.id_departamento = d.iddepartamentos where em.idEmpresa = ? and e.idempleados = ?
  `;
  connection.query(sql, [idempresa, idempleados], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener empleado por ID", error: err });
    }
    
    res.json(results[0]);
  });
}

//Buscar empleado por nombre o apellido
function searchEmployee(req, res) {
  const { nombre, idempresa } = req.params;
  const sql = `
    SELECT e.*, em.nombreEmpresa
    FROM empleados e
    JOIN empresa_departamento ed ON e.id_empresa_departamento = ed.id
    JOIN empresas em ON ed.id_empresa = em.idEmpresa
    WHERE (e.nombre LIKE ? OR e.apellido LIKE ?) AND em.idEmpresa = ?
  `;
  const searchTerm = `%${nombre}%`;
  connection.query(sql, [searchTerm, searchTerm, idempresa], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar empleado", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados con esos datos" });
    }

    res.json(results);
  });
}

//buscar por identidad
function searchEmployeeByIdentity(req, res) {
  const { identidad, idempresa } = req.params;

  if (!identidad) {
    return res.status(400).json({ message: "Debe proporcionar un valor de búsqueda" });
  }

  const sql = `
    SELECT e.*, em.nombreEmpresa
    FROM empleados e
    JOIN empresa_departamento ed ON e.id_empresa_departamento = ed.id
    JOIN empresas em ON ed.id_empresa = em.idEmpresa
    WHERE (e.identidad LIKE ? OR e.rrh_codigo LIKE ?) AND em.idEmpresa = ?
  `;

  // 🔹 '%' antes y después permite búsqueda por indicios
  const searchValue = `%${identidad}%`;

  connection.query(sql, [searchValue, searchValue, idempresa], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        message: "Error al buscar empleado", 
        error: err 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados con esos datos" });
    }

    res.json(results);
  });
}

// Obtener empleados por departamento
function getEmployeesByDepartment(req, res) {
  const { iddepartamentos, idempresa } = req.params;

  // 🔹 Validación
  if (!iddepartamentos || !idempresa) {
    return res.status(400).json({ message: "El id del departamento y empresa son obligatorios" });
  }

  const sql = `
    SELECT 
      e.*,
      em.nombreEmpresa,
      d.departamento
    FROM empleados e
    JOIN empresa_departamento ed ON e.id_empresa_departamento = ed.id
    JOIN empresas em ON ed.id_empresa = em.idEmpresa
    JOIN departamentos d ON ed.id_departamento = d.iddepartamentos
    WHERE d.iddepartamentos = ? and em.idEmpresa = ?
  `;

  connection.query(sql, [iddepartamentos, idempresa], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        message: "Error al obtener empleados por departamento", 
        error: err 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados en este departamento" });
    }

    res.json(results);
  });
}

function getEmployeeByCompany(req, res) {
  const { idempresa } = req.params;
  // 🔹 Validación
  if (!idempresa) {
    return res.status(400).json({ message: "El id de la empresa es obligatorio" });
  }

  const sql = `
    SELECT 
      e.*
    FROM empleados e
    JOIN empresa_departamento ed ON e.id_empresa_departamento = ed.id
    JOIN empresas em ON ed.id_empresa = em.idEmpresa
    JOIN departamentos d ON ed.id_departamento = d.iddepartamentos
    WHERE em.idEmpresa = ?
  `;

  connection.query(sql, [idempresa], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        message: "Error al obtener empleados por empresa", 
        error: err 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados en esta empresa" });
    }

    res.json(results);
  });
}


module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  activateOrDeactivateEmployee,
  searchEmployee,
  searchEmployeeByIdentity,
  getEmployeesByDepartment,
  getEmployeeByCompany
  
};
