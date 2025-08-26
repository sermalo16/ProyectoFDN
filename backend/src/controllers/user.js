const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("../service/jwt");

// Registro de usuario
function sign_up(req, res) {
  const { correo, password, repeatPassword, descripcion, tipo_usuario } = req.body;
  const fecha_creacion = moment().format("YYYY-MM-DD HH:mm:ss");

  if (!correo) {
    return res.status(400).send({ message: "Correo no ingresado." });
  }

  if (!password || !repeatPassword) {
    return res.status(400).send({ message: "La contraseña no fue ingresada." });
  }

  if (password !== repeatPassword) {
    return res.status(400).send({ message: "Las contraseñas no son iguales." });
  }

  if (!tipo_usuario) {
    return res.status(400).send({ message: "debe ingresar si el usuario es tecnico o solicitante." });
  }

  bcrypt.hash(repeatPassword, 8, function (err, hash) {
    if (err) {
      return res.status(500).send({ message: "Error al encriptar la contraseña." });
    }

    const insert = `
      INSERT INTO usuarios (correo, clave, fecha_creacion, estado, descripcion, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      correo.toLowerCase(),
      hash,
      fecha_creacion,
      1, // activo por defecto
      descripcion,
      tipo_usuario
    ];

    const query = mysql.format(insert, values);

    connection.query(query, (err, result) => {
      if (err) {
        if (err.errno == 1062) {
          return res.status(409).send({ message: "El correo ya ha sido registrado." });
        } else {
          return res.status(500).send({ message: "Error al registrar el usuario.", error: err });
        }
      }

      res.status(201).send({ message: "Usuario creado con éxito.", result });
    });
  });
}

// Login de usuario
function login(req, res) {
  const { user, password } = req.body;

  if (!user) {
    return res.status(400).send({ message: "Correo no ingresado." });
  }

  if (!password) {
    return res.status(400).send({ message: "Contraseña no ingresada." });
  }

  const sql = `
    SELECT idusuarios, correo, clave, estado, descripcion, tipo_usuario
    FROM usuarios
    WHERE correo = ?
  `;

  const query = mysql.format(sql, [user]);

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Error al buscar el usuario.", error });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "El correo no existe." });
    }

    const usuario = results[0];

    if (!usuario.estado) {
      return res.status(403).send({ message: "El usuario está inactivo." });
    }

    bcrypt.compare(password, usuario.clave, (err, match) => {
      if (err) {
        return res.status(500).send({ message: "Error al verificar la contraseña." });
      }

      if (!match) {
        return res.status(401).send({ message: "La contraseña es incorrecta." });
      }

      res.status(200).send({
        success: true,
        accessToken: jwt.createAccessToken(usuario),
        refreshToken: jwt.createRefreshToken(usuario),
      });
    });
  });
}

// Obtener usuarios
function getUser(req, res) {
  const sql = `
    SELECT idusuarios, correo, fecha_creacion, estado, descripcion, tipo_usuario
    FROM usuarios
    ORDER BY idusuarios ASC
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Error al obtener los usuarios.", error });
    }

    res.status(200).json(results);
  });
}
module.exports = {
    getUser,
    sign_up,
    login
};
