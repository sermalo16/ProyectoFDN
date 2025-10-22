const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

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

function getInventario(req, res) {
  const sql = `
    SELECT 
    i.idinventario,
    i.codigo_auditoria,
    i.service_tag,
    i.nombre_activo,
    i.descripcion,
    i.marca,
    i.modelo,
    i.serie,
    i.fecha_ingreso,
    i.valor,
    i.estado,
    c.idcategoria,
    c.categoria,
    ROW_NUMBER() OVER (ORDER BY i.idinventario) AS total_registros
FROM inventario i
LEFT JOIN asignaciones_detalle ad ON ad.idinventario = i.idinventario
LEFT JOIN devoluciones d ON d.idasignaciones = ad.idasignaciones AND d.estado_activo = 'DISPONIBLE'
JOIN categorias c ON i.id_categoria = c.idcategoria
WHERE ad.id IS NULL OR d.iddevoluciones IS NOT NULL
ORDER BY i.idinventario ASC;
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

function getInventarioByDepartment(req,res){
const sql = `
    SELECT 
    i.idinventario,
    i.codigo_auditoria,
    i.service_tag,
    i.nombre_activo,
    i.descripcion,
    i.marca,
    i.modelo,
    i.serie,
    i.fecha_ingreso,
    i.valor,
    c.idcategoria,
    c.categoria,
    d.iddepartamentos,
    d.departamento,
    COUNT(*) OVER () AS total_registros,
    COUNT(*) OVER (PARTITION BY d.iddepartamentos) AS total_por_departamento
FROM inventario i
JOIN categorias c ON i.id_categoria = c.idcategoria
JOIN asignaciones_detalle ad ON ad.idinventario = i.idinventario
JOIN asignaciones a ON a.idasignaciones = ad.idasignaciones
JOIN empleados e ON a.idempleado = e.idempleados
JOIN departamentos d ON d.iddepartamentos = e.iddepartamento
ORDER BY d.departamento, i.idinventario ASC;

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
  getInventarioByDepartment
};