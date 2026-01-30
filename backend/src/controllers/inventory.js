const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Crear inventario
function createInventario(req, res) {
  const {
    codigo_auditoria,
    idcategoria,
    service_tag,
    nombre_activo,
    descripcion,
    marca,
    modelo,
    serie,
    valor,
    estado
  } = req.body;

  

  if (!codigo_auditoria || !idcategoria || !descripcion  || !valor) {
    return res.status(400).send({ message: "Los campos obligatorios son requeridos.", res: req.body });
  }

  const fecha_ingreso = moment().format("YYYY-MM-DD");

  const sql = `
  INSERT INTO inventario (
    codigo_auditoria, id_categoria, service_tag, nombre_activo,
    descripcion, marca, modelo, serie, fecha_ingreso, valor, estado
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    codigo_auditoria,
    idcategoria,
    service_tag || null,
    nombre_activo || null,
    descripcion,
    marca || null,
    modelo || null,
    serie || null,
    moment(fecha_ingreso).format("YYYY-MM-DD"),
    valor,
    estado || 'DISPONIBLE'
  ];

  const query = mysql.format(sql, values);

  connection.query(query, (err, result) => {
    if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          let message = "Registro duplicado.";

          if (err.sqlMessage.includes("codigo_auditoria")) {
            message = "Ya existe un activo con el mismo código de auditoría.";
          } else if (err.sqlMessage.includes("service_tag")) {
            message = "Ya existe un activo con el mismo service tag.";
          }else if (err.sqlMessage.includes("serie")) {
            message = "Ya existe un activo con la misma serie.";
          }

          return res.status(400).send({ message });
        }

        return res.status(500).json({
          message: "Error al crear activo",
          error: err
        });
      }

    res.status(201).send({ message: "Activo registrado con éxito.", result });
  });
}

//obtener todos los activos que existen
function getInventarioExist(req, res) {
  const sql = `
    
SELECT *
FROM inventario;
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario.", error: err });
    }
    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));
    res.status(200).json(data);
  });
}

// Obtener inventario disponible general
function getInventario(req, res) {
  const sql = `
    
SELECT *
FROM inventario
WHERE estado = 'disponible';

  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario.", error: err });
    }

    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));

    res.status(200).json(data);
  });
}

//ver inventario por categorias
function getInventarioByCategory(req, res) {
  const { id_categoria } = req.params;
  const sql = `
    
SELECT *
FROM inventario
WHERE id_categoria = ?;
  `;

  connection.query(sql, [id_categoria], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario por categoría.", error: err });
    }

    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));

    res.status(200).json(data);
  });
}

//obtener inventario asignado general
function getInventoryAsigned(req, res) {
  const sql = `
    
SELECT *
FROM inventario
WHERE estado = 'asignado';
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario Asignado.", error: err });
    }

    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));

    res.status(200).json(data);
  });
}

//obtener inventario asignado por categorias
function getInventoryAsignedByCategory(req, res) {
  const { id_categoria } = req.params;
  const sql = `
    
SELECT *
FROM inventario
WHERE estado = 'asignado' AND id_categoria = ?;
  `;

  connection.query(sql, [id_categoria], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario Asignado por categoria.", error: err });
    }

    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));

    res.status(200).json(data);
  });
}

//obtener inventario disponible por categorias
function getInventoryAvailableByCategory(req, res) {
  const { id_categoria } = req.params;
  const sql = `
    
SELECT *
FROM inventario
WHERE estado = 'disponible' AND id_categoria = ?;
  `;
  connection.query(sql, [id_categoria], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario Disponible por categoria.", error: err });
    }
    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));
    res.status(200).json(data);
  });
}

//Obtener inventario asignado por ID de empleado
function getInventoryAsignedByEmployee(req, res) {
  const { id_empleado } = req.params;
  const sql = `select i.* from inventario i join asignacion_detalle ad on i.idinventario = ad.idinventario join asignaciones a on ad.idasignacion = a.idasignacion 
join empleados e on a.idempleado = e.idempleados where e.idempleados = ? and i.estado = 'asignado';`;

  connection.query(sql, [id_empleado], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario asignado por empleado.", error: err });
    } 

    const data = results.map(row => ({
      ...row,
      fecha_ingreso: moment(row.fecha_ingreso).format("YYYY-MM-DD")
    }));

    res.status(200).json(data);
  });
}



//dar de baja el inventario
function WriteOffInvetory(req, res) {
  const { idinventario } = req.params;
  const { fecha_baja, motivo_de_baja, realizado_por } = req.body;

 // 🔹 Validación centralizada
  const requiredFields = {
    idinventario: "El ID del inventario es obligatorio",
    fecha_baja: "La fecha de baja es obligatoria",
    motivo_de_baja: "El motivo de baja es obligatorio",
    realizado_por: "El responsable de la baja es obligatorio"
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      return res.status(400).json({ message });
    }
  }
  const sql = `INSERT INTO inventario_defectuoso (idinventario, fecha_baja, motivo_de_baja, realizado_por) VALUES (?, ?, ?, ?)`;

  const values = [
    idinventario,
    fecha_baja,
    motivo_de_baja,
    realizado_por,
  ];

  const query = mysql.format(sql, values);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al dar de baja el activo.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Activo no encontrado." });
    }

    res.status(200).send({ message: "Activo dado de baja con éxito." });
  });
}

//ver quien le da baja al inventario
//colocar activo en reparacion







// Actualizar inventario
function updateInventario(req, res) {
  const { idinventario } = req.params;
  const {
    codigo_auditoria,
    idcategoria,
    service_tag,
    nombre_activo,
    descripcion,
    marca,
    modelo,
    serie,
    valor
  } = req.body;
  
  if (!codigo_auditoria || !idcategoria || !descripcion  || !valor) {
    return res.status(400).send({ message: "Todos los campos obligatorios deben estar completos." });
  }

  const sql = `
    UPDATE inventario SET
      codigo_auditoria = ?, id_categoria = ?, service_tag = ?, nombre_activo = ?,
      descripcion = ?, marca = ?, modelo = ?, serie = ?, valor = ?
    WHERE idinventario = ?
  `;

  const values = [
    codigo_auditoria,
    idcategoria,
    service_tag || null,
    nombre_activo || null,
    descripcion,
    marca || null,
    modelo || null,
    serie || null,
    valor,
    idinventario
  ];

  const query = mysql.format(sql, values);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al actualizar el activo.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Activo no encontrado." });
    }

    res.status(200).send({ message: "Activo actualizado con éxito." });
  });
}

// Eliminar inventario
function deleteInventario(req, res) {
  const { idinventario } = req.params;

  const sql = "DELETE FROM inventario WHERE idinventario = ?";
  const query = mysql.format(sql, [idinventario]);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al eliminar el activo.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Activo no encontrado." });
    }

    res.status(200).send({ message: "Activo eliminado con éxito." });
  });
}

module.exports = {
  createInventario,
  getInventario,
  updateInventario,
  deleteInventario,
  getInventarioByCategory,
  getInventoryAsigned,
  getInventoryAsignedByCategory,
  getInventoryAvailableByCategory,
  getInventoryAsignedByEmployee,
  getInventarioExist
};