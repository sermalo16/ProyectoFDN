// middleware/auth.js
const jwt = require('jwt-simple');
const moment = require('moment');

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = jwt.decode(token, process.env.SECRET_KEY);

    if (payload.exp && payload.exp <= moment().unix()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Guardamos datos del usuario autenticado para usarlos en la ruta
    req.user = {
      id: payload.id,                 // <--- aquí va el id que tú generas en createAccessToken
      identidad: payload.identidad,
      correo: payload.Correo || payload.correo,
      roles: payload.Roles,
      rrh_codigo: payload.rrh_codigo,
      nombre: payload.nombre,
      apellido: payload.apellido
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};