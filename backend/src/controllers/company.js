const { connection } = require("../database/config.db");
const mysql = require("mysql");


// Obtener todas las empresas
function getcompany(req, res) {
  const sql = "SELECT * FROM empresas order by idEmpresa asc";

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener las empresas.", error: err });
    }
    res.status(200).json(results);
  });
}

// Obtener empresa por ID
function getcompanyById(req, res) {
  const { id } = req.params;
  const sql = "SELECT * FROM empresas WHERE idEmpresa = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Error al obtener la empresa.",
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).send({
        message: "Empresa no encontrada."
      });
    }

    res.status(200).json(results[0]);
  });
}

// Crear empresa (manejo de duplicados desde la BD)
function createcompany(req, res) {
  const {
    nombreEmpresa,
    Descripcion,
    rtn,
    Imagen,
    direccion,
    telefono
  } = req.body;

  const sql = `
    INSERT INTO empresas 
    (nombreEmpresa, Descripcion, rtn, Imagen, direccion, telefono)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [nombreEmpresa, Descripcion, rtn, Imagen, direccion, telefono],
    (err, result) => {
      if (err) {

        // Duplicado (RTN o nombre)
        if (err.code === "ER_DUP_ENTRY") {
          let message = "Registro duplicado.";

          if (err.sqlMessage.includes("rtn")) {
            message = "Ya existe una empresa con este RTN.";
          } else if (err.sqlMessage.includes("nombreEmpresa")) {
            message = "Ya existe una empresa con este nombre.";
          }

          return res.status(400).send({ message });
        }

        // Otros errores
        return res.status(500).send({
          message: "Error al crear la empresa.",
          error: err
        });
      }

      res.status(201).send({
        message: "Empresa creada correctamente.",
        idEmpresa: result.insertId
      });
    }
  );
}


// Actualizar empresa (manejo de duplicados desde BD)
function updatecompany(req, res) {
  const { id } = req.params;
  const {
    nombreEmpresa,
    Descripcion,
    rtn,
    Imagen,
    direccion,
    telefono
  } = req.body;

  const sql = `
    UPDATE empresas SET
      nombreEmpresa = ?,
      Descripcion = ?,
      rtn = ?,
      Imagen = ?,
      direccion = ?,
      telefono = ?
    WHERE idEmpresa = ?
  `;

  connection.query(
    sql,
    [nombreEmpresa, Descripcion, rtn, Imagen, direccion, telefono, id],
    (err, result) => {
      if (err) {

        // Duplicado (RTN o nombre)
        if (err.code === "ER_DUP_ENTRY") {
          let message = "Registro duplicado.";

          if (err.sqlMessage.includes("rtn")) {
            message = "Ya existe una empresa con este RTN.";
          } else if (err.sqlMessage.includes("nombreEmpresa")) {
            message = "Ya existe una empresa con este nombre.";
          }

          return res.status(400).send({ message });
        }

        return res.status(500).send({
          message: "Error al actualizar la empresa.",
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({
          message: "Empresa no encontrada."
        });
      }

      res.status(200).send({
        message: "Empresa actualizada correctamente."
      });
    }
  );
}

// Eliminar empresa
function deletecompany(req, res) {
  const { id } = req.params;
  const sql = "DELETE FROM empresas WHERE idEmpresa = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send({
        message: "Error al eliminar la empresa.",
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({
        message: "Empresa no encontrada."
      });
    }

    res.status(200).send({
      message: "Empresa eliminada correctamente."
    });
  });
}


module.exports = {
  getcompany,
  getcompanyById,
  createcompany,
  updatecompany,
  deletecompany
};

