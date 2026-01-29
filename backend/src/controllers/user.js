const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("../service/jwt");

//login
//inicio de sesion
function login(req, res) {
  const { correo, clave } = req.body;

  const sql = `
    SELECT 
      idempleados,
      identidad,
      Correo,
      Roles,
      rrh_codigo,
      nombre,
      apellido,
      estado,
      clave
    FROM empleados
    WHERE correo = ? OR identidad = ?
    LIMIT 1
  `;
  connection.query(sql, [correo, correo], (err, results) => {
    if (err) return res.status(500).json({ message: "Error servidor" });
    if (results.length === 0) {
      return res.status(404).json({ message: "Correo o identidad no existe" });
    }

    const empleado = results[0];

    if (!empleado.estado) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    bcrypt.compare(clave, empleado.clave, (err, match) => {
      if (!match) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      res.json({
        success: true,
        accessToken: jwt.createAccessToken(empleado),
        refreshToken: jwt.createRefreshToken(empleado),
      });
    });
  });
}

module.exports = {
    login
};
