const { connection } = require("../database/config.db");
const mysql = require("mysql");

// Obtener todos los departamentos
function getdeparment(req, res) {
  const sql = "SELECT * FROM departamentos order by iddepartamentos asc";

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los departamentos.", error: err });
    }
    res.status(200).json(results);
  });
}

// Crear departamento
function createDepartment(req, res) {
  const { departamento } = req.body;

  if (!departamento) {
    return res.status(400).send({ message: "Llene el campo." });
  }

  const sql = "INSERT INTO departamentos (departamento) VALUES (?)";

  connection.query(sql, [departamento], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send({
          message: "El departamento ya existe."
        });
      }

      return res.status(500).send({
        message: "Error al crear el departamento.",
        error: err
      });
    }

    res.status(201).send({
      message: "Departamento de " + departamento + " creado con éxito.",
      iddepartamentos: result.insertId
    });
  });
}


// Actualizar departamento
function updateDepartment(req, res) {
  const { iddepartamentos } = req.params;
  const { departamento } = req.body;

  if (!departamento) {
    return res.status(400).send({
      message: "El nombre del departamento es obligatorio."
    });
  }

  const sql = `
    UPDATE departamentos 
    SET departamento = ? 
    WHERE iddepartamentos = ?
  `;

  connection.query(sql, [departamento, iddepartamentos], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send({
          message: "El departamento ya existe."
        });
      }

      return res.status(500).send({
        message: "Error al actualizar el departamento.",
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({
        message: "Departamento no encontrado."
      });
    }

    res.status(200).send({
      message: "Departamento actualizado con éxito."
    });
  });
}



// Eliminar departamento
function deleteDepartment(req, res) {
  const { iddepartamentos } = req.params;

  const deleteRelationSql =
    "DELETE FROM empresa_departamento WHERE id_departamento = ?";

  connection.query(deleteRelationSql, [iddepartamentos], (err) => {
    if (err) {
      return res.status(500).send({
        message: "Error al eliminar relaciones del departamento.",
        error: err
      });
    }

    const deleteSql =
      "DELETE FROM departamentos WHERE iddepartamentos = ?";

    connection.query(deleteSql, [iddepartamentos], (err, result) => {
      if (err) {
        return res.status(500).send({
          message: "Error al eliminar el departamento.",
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({
          message: "Departamento no encontrado."
        });
      }

      res.status(200).send({
        message: "Departamento eliminado con éxito."
      });
    });
  });
}

// Asignar departamento a empresa
function addDepartmentToCompany(req, res) {
  const { id_empresa, id_departamento } = req.body;

  if (!id_empresa || !id_departamento) {
    return res.status(400).send({
      message: "Empresa y departamento son obligatorios."
    });
  }

  const sql = `
    INSERT INTO empresa_departamento (id_empresa, id_departamento)
    VALUES (?, ?)
  `;

  connection.query(sql, [id_empresa, id_departamento], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send({
          message: "El departamento ya está asignado a esta empresa."
        });
      }

      return res.status(500).send({
        message: "Error al asignar el departamento.",
        error: err
      });
    }

    res.status(201).send({
      message: "Departamento asignado correctamente."
    });
  });
}


// Obtener departamentos por empresa
function getDepartmentsByCompany(req, res) {
  const { idEmpresa } = req.params;

  const sql = `
    SELECT d.iddepartamentos, d.departamento
    FROM empresa_departamento ed
    INNER JOIN departamentos d ON ed.id_departamento = d.iddepartamentos
    WHERE ed.id_empresa = ?
    ORDER BY d.departamento ASC
  `;

  connection.query(sql, [idEmpresa], (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Error al obtener los departamentos de la empresa.",
        error: err
      });
    }

    res.status(200).json(results);
  });
}

// Quitar departamento de empresa
function removeDepartmentFromCompany(req, res) {
  const { id_empresa, id_departamento } = req.params;

  const sql = `
    DELETE FROM empresa_departamento 
    WHERE id_empresa = ? AND id_departamento = ?
  `;

  connection.query(sql, [id_empresa, id_departamento], (err, result) => {
    if (err) {
      return res.status(500).send({
        message: "Error al quitar el departamento.",
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({
        message: "Relación no encontrada."
      });
    }

    res.status(200).send({
      message: "Departamento removido de la empresa."
    });
  });
}


module.exports = {
  getdeparment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addDepartmentToCompany,
  getDepartmentsByCompany,
  removeDepartmentFromCompany
};
