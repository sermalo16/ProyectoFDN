const { connection } = require("../database/config.db");
const mysql = require("mysql");

// Obtener todas las categorías
function getCategories(req, res) {
  const sql = "SELECT * FROM categorias ORDER BY idcategoria ASC";

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener las categorías.", error: err });
    }
    res.status(200).json(results);
  });
}

// Crear una categoría
function createCategory(req, res) {
  const { categoria } = req.body;

  if (!categoria) {
    return res.status(400).send({ message: "El campo 'categoría' es obligatorio." });
  }

  const insert = "INSERT INTO categorias (categoria) VALUES (?)";
  const query = mysql.format(insert, [categoria]);

  connection.query(query, (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(409).send({ message: "La categoría ya existe." });
      } else if (err.errno === -4078 || !err.errno) {
        return res.status(500).send({ message: "Error al conectarse con la base de datos." });
      } else {
        return res.status(500).send({ message: "Error desconocido.", error: err });
      }
    }

    res.status(201).send({ message: "Categoría creada con éxito.", result });
  });
}

// Actualizar una categoría
function updateCategory(req, res) {
  const { idcategoria } = req.params;
  const { categoria } = req.body;

  if (!categoria) {
    return res.status(400).send({ message: "El nombre de la categoría es obligatorio." });
  }

  const sql = "UPDATE categorias SET categoria = ? WHERE idcategoria = ?";
  const query = mysql.format(sql, [categoria, idcategoria]);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al actualizar la categoría.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Categoría no encontrada." });
    }

    res.status(200).send({ message: "Categoría actualizada con éxito." });
  });
}

// Eliminar una categoría
function deleteCategory(req, res) {
  const { idcategoria } = req.params;

  const sql = "DELETE FROM categorias WHERE idcategoria = ?";
  const query = mysql.format(sql, [idcategoria]);

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error al eliminar la categoría.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Categoría no encontrada." });
    }

    res.status(200).send({ message: "Categoría eliminada con éxito." });
  });
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
