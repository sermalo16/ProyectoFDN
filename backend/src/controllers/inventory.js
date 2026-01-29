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
      if (err.errno === 1062) {
        return res.status(409).send({ message: "El código de auditoría ya existe." });
      }
      console.error(err);
      return res.status(500).send({ message: "Error al registrar el activo." });
    }

    res.status(201).send({ message: "Activo registrado con éxito.", result });
  });
}

// Obtener inventario disponible
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
//Obtener inventario asignado por ID de usuario
//dar de baja el inventario
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
  getInventarioByCategory
};