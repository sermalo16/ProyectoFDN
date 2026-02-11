const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const fs = require("fs");
const path = require("path");



//#region funciones get
//obtener todos los activos que existen
function getInventarioExist(req, res) {
  const sql = `SELECT
  ROW_NUMBER() OVER (ORDER BY i.idinventario) AS item_num,
  i.*,
  c.categoria
FROM inventario AS i
JOIN categorias AS c
  ON i.id_categoria = c.idcategoria
ORDER BY i.idinventario;`;
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

//ver quin le da de baja al inventario
function getWhoWriteOffInventory(req, res) {
  const { idinventario } = req.params;
  const sql = `
    SELECT idempleados, identidad, Correo, Roles, rrh_codigo, nombre, apellido
    FROM empleados e join inventario_defectuoso id on e.idempleados = id.realizado_por where id.idinventario = ?;
  `;
  connection.query(sql, [idinventario], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener quien dio de baja el inventario.", error: err });
    }
    res.status(200).json(results);
  });

}

//ver quien llevo a reparacion el inventario
function getWhoRepairInventory(req, res) {
  const { idinventario } = req.params;
  const sql = `
    select i.codigo_auditoria, i.marca, i.modelo, i.valor, CONCAT(e.nombre, ' ', e.apellido) as QuienIngresoEquipoReparacion, ri.* from inventario i join reparaciones_inventario ri on i.idinventario = ri.id_inventario
    join empleados e on ri.realizado_por = e.idempleados
    where i.idinventario = ?;`;
  connection.query(sql, [idinventario], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener quien llevo a reparacion el inventario.", error: err });
    }
    res.status(200).json(results);
  });
}

//ver equipo en reparacion por categoria
function getInventoryInRepairByCategory(req, res) {
  const { id_categoria } = req.params;
  const sql = `select i.codigo_auditoria, i.marca, i.modelo, i.valor,i.serie,i.service_tag, ri.* from reparaciones_inventario ri join inventario i on ri.id_inventario = i.idinventario 
    join categorias c on i.id_categoria = c.idcategoria where c.idcategoria = ?;`;
  connection.query(sql, [id_categoria], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener el inventario en reparacion por categoria.", error: err });
    }
    res.status(200).json(results);
  });
}

//obtener inventario por codigo, servicetag, serie, descripcion
function getInventoryByServiceTag(req, res) { 
  const { service_tag } = req.params; 
  const sql = ` SELECT * FROM inventario WHERE service_tag LIKE ?; `; 
  const searchTerm = `%${service_tag}%`; 
  connection.query(sql, [searchTerm], (err, results) => { 
    if (err) { 
      return res.status(500).send({ message: "Error al buscar por service_tag.", error: err }); 
    } 
      res.status(200).json(results); 
  }); 
}

//buscar inventario por serie
function getInventoryBySerie(req, res) {
  const { serie } = req.params;
  const sql = `
    SELECT *
    FROM inventario
    WHERE serie LIKE ?;
  `;
  const searchTerm = `%${serie}%`;

  connection.query(sql, [searchTerm], (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Error al buscar por serie.",
        error: err
      });
    }
    res.status(200).json(results);
  });
}

//buscar inventario por codigo de auditoria
function getInventoryByCodigoAuditoria(req, res) {
  const { codigo_auditoria } = req.params;
  const sql = `
    SELECT *
    FROM inventario
    WHERE codigo_auditoria LIKE ?;
  `;
  const searchTerm = `%${codigo_auditoria}%`;

  connection.query(sql, [searchTerm], (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Error al buscar por código de auditoría.",
        error: err
      });
    }
    res.status(200).json(results);
  });
}


//#endregion

//#region funciones post
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

  const requiredFields = {
    codigo_auditoria: "El código de auditoría es obligatorio.",
    idcategoria: "La categoría es obligatoria.",
    descripcion: "La descripción es obligatoria.",
    valor: "El valor es obligatorio.",
    serie: "La serie es obligatoria.",
    service_tag: "El service tag es obligatorio.",
    nombre_activo: "El nombre del activo es obligatorio."
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      return res.status(400).json({ message });
    }
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

//dar de baja el inventario
function WriteOffInvetory(req, res) {
  const { idinventario, realizado_por } = req.params;
  const { motivo_de_baja } = req.body;
 console.log(req.params);
  if (!motivo_de_baja){
    return res.status(400).send({ message: "El motivo de la baja es obligatorio." });
  }

  const fecha_baja = moment().format("YYYY-MM-DD");
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

//colocar activo en reparacion
function RepairInventory(req, res) {
  const { idinventario, realizado_por } = req.params;
  const { proveedorReparacion, descripcionteparacion, costo } = req.body;

  const requiredFields = {
    proveedorReparacion: "El proveedor de reparación es obligatorio.",
    descripcionteparacion: "La descripción de la reparación es obligatoria.",
    costo : "El costo de la reparación es obligatorio."
  }

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      return res.status(400).json({ message });
    }
  }

  const fecha_ingreso = moment().format("YYYY-MM-DD"); 

  const sql = `INSERT INTO reparaciones_inventario (id_inventario, fecha_ingreso, proveedorReparacion, descripcionteparacion, costo, realizado_por) VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    idinventario,
    fecha_ingreso,
    proveedorReparacion,
    descripcionteparacion,
    costo,
    realizado_por,
  ];

  const query = mysql.format(sql, values);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al registrar la reparación del activo.", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Activo no encontrado." });
    }
    res.status(200).send({ message: "Reparación del activo registrada con éxito." });
  });

}



//#endregion







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
  getInventarioExist,
  WriteOffInvetory,
  getWhoWriteOffInventory,
  getWhoRepairInventory,
  RepairInventory,
  getInventoryInRepairByCategory,
  getInventoryByServiceTag,
  getInventoryBySerie,
  getInventoryByCodigoAuditoria
};