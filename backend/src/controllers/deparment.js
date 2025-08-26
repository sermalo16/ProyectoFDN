const { connection } = require("../database/config.db");
const mysql = require("mysql");

// Obtener todos los empleados
function getdeparment(req, res) {
  const sql = "SELECT * FROM departamentos order by iddepartamentos asc";

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los departamentos.", error: err });
    }
    res.status(200).json(results);
  });
}


//Crear un departamento

function createDepartment(req, res) {
  const { departamento } = req.body;

  if (!departamento) {
    return res.status(400).send({ message: "Llene el campo." });
  }

  const insert = `
    INSERT INTO departamentos (departamento) VALUES (?)`;

  const query = mysql.format(insert, [departamento]);

  connection.query(query, (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(409).send({ message: "El departamento ya existe." });
      } else if (err.errno === -4078 || !err.errno) {
        return res.status(500).send({ message: "Error al conectarse con la base de datos." });
      } else {
        return res.status(500).send({ message: "Error desconocido.", error: err });
      }
    }

    res.status(201).send({ message: "Departamento creado con éxito.", result });
  });
}


// Actualizar departamento
function updateDepartment(req, res) {
  const { iddepartamentos } = req.params;
  const { departamento } = req.body;

  if (!departamento) {
    return res.status(400).send({ message: "El nombre del departamento es obligatorio." });
  }



  const sql = "UPDATE departamentos SET departamento = ? WHERE iddepartamentos = ?";
  const query = mysql.format(sql, [departamento, iddepartamentos]);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al actualizar el departamento.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Departamento no encontrado."});
    }

    res.status(200).send({ message: "Departamento actualizado con éxito." });
  });
}


// Eliminar departamento
function deleteDepartment(req, res) {
  const { iddepartamentos } = req.params;

  const sql = "DELETE FROM departamentos WHERE iddepartamentos = ?";
  const query = mysql.format(sql, [iddepartamentos]);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al eliminar el departamento.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Departamento no encontrado." });
    }

    res.status(200).send({ message: "Departamento eliminado con éxito." });
  });
}

module.exports = {
  getdeparment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
