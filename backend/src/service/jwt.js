const jwt = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

exports.createAccessToken = function(user) {
  const payload = {
    id: user.idusuarios,
    user: user.correo,
    description: user.descripcion,
    tipo: user.tipo_usuario,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix()
  };

  return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.createRefreshToken = function(user) {
  const payload = {
    id: user.idusuarios,
    exp: moment().add(3, "hours").unix()
  };

  return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.decodedToken = function(token) {
  return jwt.decode(token, process.env.SECRET_KEY, true);
};
