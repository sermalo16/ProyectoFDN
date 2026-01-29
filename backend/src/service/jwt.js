const jwt = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

exports.createAccessToken = function(empleado) {
  const payload = {
    id: empleado.idempleados,
    identidad: empleado.identidad,
    correo: empleado.Correo,
    Roles: empleado.Roles,
    rrh_codigo: empleado.rrh_codigo,
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix()
  };

  return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.createRefreshToken = function(empleado) {
  const payload = {
    id: empleado.idempleados,
    exp: moment().add(3, "hours").unix()
  };

  return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.decodedToken = function(token) {
  return jwt.decode(token, process.env.SECRET_KEY, true);
};
