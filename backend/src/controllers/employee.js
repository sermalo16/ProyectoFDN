const { connection } = require("../database/config.db");
const mysql = require("mysql");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

function getEmployees(req, res) {
  const sql = `
    SELECT 
    COUNT(*) OVER () AS total_registros,
      e.idempleados,
      e.identidad,
      e.rrh_codigo,
      e.nombre,
      e.apellido,
      e.puesto,
      e.fecha_nacimiento,
      e.iddepartamento,
      d.departamento,
      e.fecha_ingreso,
      e.telefono,
      e.foto,
      e.create_date,
      u.idusuarios,
      u.correo,
      u.descripcion,
      u.tipo_usuario,
      u.estado,
      u.fecha_creacion
    FROM empleados e
    INNER JOIN usuarios u ON e.idusuarios = u.idusuarios join departamentos d on  e.iddepartamento = d.iddepartamentos
  `;

  

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los empleados.", error: err });
    }

    const baseUrl = req.protocol + "://" + req.get("host"); // ej: http://localhost:3308

    const empleadosFormateados = results.map(emp => ({
      ...emp,
      fecha_nacimiento: moment(emp.fecha_nacimiento).format("YYYY-MM-DD"),
      fecha_ingreso: moment(emp.fecha_ingreso).format("YYYY-MM-DD"),
      create_date: moment(emp.create_date).format("YYYY-MM-DD"),
      foto: emp.foto ? `${baseUrl}/uploads/empleados/${emp.foto}` : null
    }));

    res.status(200).json(empleadosFormateados);
  });
}

function getEmployeeById(req, res) {
  const { idempleados } = req.params;

  const query = `
    SELECT 
      e.idempleados,
      e.identidad,
      e.rrh_codigo,
      e.nombre,
      e.apellido,
      e.puesto,
      e.fecha_nacimiento,
      e.iddepartamento,
      e.fecha_ingreso,
      e.telefono,
      e.foto,
      e.create_date,
      u.idusuarios,
      u.correo,
      u.descripcion,
      u.tipo_usuario,
      u.estado,
      u.fecha_creacion
    FROM empleados e
    INNER JOIN usuarios u ON e.idusuarios = u.idusuarios
    WHERE e.idempleados = ?
  `;

  connection.query(query, [idempleados], (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al obtener el empleado.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    res.status(200).send(results[0]);
  });
}

function createEmployee(req, res) {
  const usuario = JSON.parse(req.body.usuario);
  const empleado = JSON.parse(req.body.empleado);

  const {
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    iddepartamento,
    fecha_ingreso,
    telefono,
  } = empleado;

  const {
    correo,
    clave,
    estado = 1,
    descripcion,
    tipo_usuario
  } = usuario;

  const create_date = moment().format("YYYY-MM-DD HH:mm:ss");
  const foto = req.file ? req.file.filename : null; // Si usás multer

  // Validaciones básicas
  if (!identidad || !rrh_codigo || !nombre || !apellido || !puesto || !fecha_nacimiento || !fecha_ingreso || !telefono || !iddepartamento) {
    return res.status(400).send({ message: "Todos los campos del empleado son obligatorios." });
  }

  if (!correo || !clave || !tipo_usuario) {
    return res.status(400).send({ message: "Faltan campos obligatorios del usuario." });
  }

  // Encriptar la contraseña
  bcrypt.hash(clave, 8, (err, hash) => {
    if (err) {
      return res.status(500).send({ message: "Error al encriptar la contraseña." });
    }

    const insertUsuario = `
      INSERT INTO usuarios (correo, clave, fecha_creacion, estado, descripcion, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const usuarioValues = [
      correo.toLowerCase(),
      hash,
      create_date,
      estado,
      descripcion,
      tipo_usuario
    ];

    connection.query(insertUsuario, usuarioValues, (err, usuarioResult) => {
      if (err) {
        if (err.errno === 1062) {
          return res.status(409).send({ message: "El correo ya ha sido registrado.", err });
        } else {
          return res.status(500).send({ message: "Error al registrar el usuario.", error: err });
        }
      }

      const idusuarios = usuarioResult.insertId;

      const insertEmpleado = `
        INSERT INTO empleados (
          identidad, rrh_codigo, nombre, apellido, puesto,
          fecha_nacimiento, iddepartamento, fecha_ingreso,foto, telefono, idusuarios
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;

      const empleadoValues = [
        identidad, rrh_codigo, nombre, apellido, puesto,
        fecha_nacimiento, iddepartamento, fecha_ingreso, foto, telefono, idusuarios
      ];

      connection.query(insertEmpleado, empleadoValues, (err, empleadoResult) => {
        if (err) {
          return res.status(500).send({ message: "Error al registrar el empleado.", error: err });
        }

        return res.status(201).send({
          message: "Empleado y usuario registrados con éxito.",
          usuario_id: idusuarios,
          empleado_id: empleadoResult.insertId
        });
      });
    });
  });
}

function deleteEmployee(req, res) {
  const { idusuarios } = req.params;
  console.log("ID recibido para eliminación:", idusuarios);

  const deleteEmpleado = `DELETE FROM empleados WHERE idusuarios = ?`;

  connection.query(deleteEmpleado, [idusuarios], (err, resultEmpleado) => {
    if (err) {
      return res.status(500).send({ message: "Error al eliminar empleado.", error: err });
    }

    if (resultEmpleado.affectedRows === 0) {
      return res.status(404).send({ message: "No se encontró un empleado con ese ID." +  idusuarios });
    }

    const deleteUsuario = `DELETE FROM usuarios WHERE idusuarios = ?`;

    connection.query(deleteUsuario, [idusuarios], (err, resultUsuario) => {
      if (err) {
        return res.status(500).send({ message: "Error al eliminar usuario.", error: err });
      }

      if (resultUsuario.affectedRows === 0) {
        return res.status(404).send({ message: "Empleado eliminado, pero no se encontró el usuario." });
      }

      return res.status(200).send({ message: "Empleado y usuario eliminados con éxito." });
    });
  });
}


function updateEmployee(req, res) {
  const { idusuarios } = req.params;
  const usuario = JSON.parse(req.body.usuario);
    const empleado = JSON.parse(req.body.empleado);


  const {
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    iddepartamento,
    fecha_ingreso,
    telefono
  } = empleado;

  const {
    correo,
    clave,
    estado,
    descripcion,
    tipo_usuario
  } = usuario;

  console.log(identidad)

  const foto = req.file ? req.file.filename : null; // Si usás multer

  // Validaciones básicas
  if (!correo) {
    return res.status(400).send({ message: "Ingresar el correo." });
  }
  if (!tipo_usuario) {
    return res.status(400).send({ message: "Tipo de usuario Obligatorio." });
  }
  if (!identidad) {
    return res.status(400).send({ message: "El DNI es obligatorio." });
  }
  if (!nombre) {
    return res.status(400).send({ message: "El nombre es Obligatorio" });
  }

  const updateUsuario = () => {
    const sqlUsuario = `
      UPDATE usuarios SET
        correo = ?,
        estado = ?,
        descripcion = ?,
        tipo_usuario = ?
      WHERE idusuarios = ?
    `;

    const valuesUsuario = [
      correo.toLowerCase(),
      estado,
      descripcion,
      tipo_usuario,
      idusuarios
    ];

    connection.query(sqlUsuario, valuesUsuario, (err, result) => {
      if (err) return res.status(500).send({ message: "Error actualizando usuario.", error: err });

      

      const sqlEmpleado = `
        UPDATE empleados SET
          identidad = ?, rrh_codigo = ?, nombre = ?, apellido = ?, puesto = ?,
          fecha_nacimiento = ?, iddepartamento = ?, fecha_ingreso = ?, foto = ?, telefono = ?
        WHERE idusuarios = ?
      `;

      const valuesEmpleado = [
        identidad, rrh_codigo, nombre, apellido, puesto,
        fecha_nacimiento, iddepartamento, fecha_ingreso, foto, telefono, idusuarios
      ];

      connection.query(sqlEmpleado, valuesEmpleado, (err, result) => {
        if (err) return res.status(500).send({ message: "Error actualizando empleado.", error: err });

        

        return res.status(200).send({ message: "Empleado y usuario actualizados con éxito." });
      });
    });
  };

  // Si se envía una nueva clave, la encriptamos primero
  if (clave) {
    bcrypt.hash(clave, 8, (err, hash) => {
      if (err) return res.status(500).send({ message: "Error al encriptar la nueva contraseña." });

      const sqlClave = `UPDATE usuarios SET clave = ? WHERE idusuarios = ?`;

      connection.query(sqlClave, [hash, idusuarios], (err) => {
        if (err) return res.status(500).send({ message: "Error actualizando contraseña.", error: err });

        updateUsuario(); // Continúa con el resto de campos
      });
    });
  } else {
    updateUsuario(); // No hay cambio de contraseña
  }
}

function getTechnicians(req,res){
  const sql = `
    SELECT 
    COUNT(*) OVER () AS total_registros,
      e.idempleados,
      e.identidad,
      e.rrh_codigo,
      e.nombre,
      e.apellido,
      e.puesto,
      e.fecha_nacimiento,
      e.iddepartamento,
      d.departamento,
      e.fecha_ingreso,
      e.telefono,
      e.foto,
      e.create_date,
      u.idusuarios,
      u.correo,
      u.descripcion,
      u.tipo_usuario,
      u.estado,
      u.fecha_creacion
    FROM empleados e
    INNER JOIN usuarios u ON e.idusuarios = u.idusuarios join departamentos d on  e.iddepartamento = d.iddepartamentos
    where u.tipo_usuario = "tecnico"
  `;

  

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los empleados.", error: err });
    }

    const baseUrl = req.protocol + "://" + req.get("host"); // ej: http://localhost:3308

    const empleadosFormateados = results.map(emp => ({
      ...emp,
      fecha_nacimiento: moment(emp.fecha_nacimiento).format("YYYY-MM-DD"),
      fecha_ingreso: moment(emp.fecha_ingreso).format("YYYY-MM-DD"),
      create_date: moment(emp.create_date).format("YYYY-MM-DD"),
      foto: emp.foto ? `${baseUrl}/uploads/empleados/${emp.foto}` : null
    }));

    res.status(200).json(empleadosFormateados);
  });
}
function getapplicants(req,res){
  const sql = `
    SELECT 
    COUNT(*) OVER () AS total_registros,
      e.idempleados,
      e.identidad,
      e.rrh_codigo,
      e.nombre,
      e.apellido,
      e.puesto,
      e.fecha_nacimiento,
      e.iddepartamento,
      d.departamento,
      e.fecha_ingreso,
      e.telefono,
      e.foto,
      e.create_date,
      u.idusuarios,
      u.correo,
      u.descripcion,
      u.tipo_usuario,
      u.estado,
      u.fecha_creacion
    FROM empleados e
    INNER JOIN usuarios u ON e.idusuarios = u.idusuarios join departamentos d on  e.iddepartamento = d.iddepartamentos
    where u.tipo_usuario = "Solicitante"
  `;

  

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los empleados.", error: err });
    }

    const baseUrl = req.protocol + "://" + req.get("host"); // ej: http://localhost:3308

    const empleadosFormateados = results.map(emp => ({
      ...emp,
      fecha_nacimiento: moment(emp.fecha_nacimiento).format("YYYY-MM-DD"),
      fecha_ingreso: moment(emp.fecha_ingreso).format("YYYY-MM-DD"),
      create_date: moment(emp.create_date).format("YYYY-MM-DD"),
      foto: emp.foto ? `${baseUrl}/uploads/empleados/${emp.foto}` : null
    }));

    res.status(200).json(empleadosFormateados);
  });
}


/*
// Crear un nuevo empleado
function createEmployee(req, res) {
  
  const {
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    iddepartamento,
    fecha_ingreso,
    telefono,
    
  } = req.body;

  

  // Validaciones básicas
  if (!identidad || !rrh_codigo || !nombre || !apellido || !puesto || !fecha_nacimiento || !fecha_ingreso || !telefono || !iddepartamento) {
    return res.status(400).send({ message: "Todos los campos son obligatorios." });
  }

  const create_date = moment().format();
  const foto = req.file ? req.file.filename : null; // Si usás multer

  let insert = `
    INSERT INTO empleados (identidad, rrh_codigo, nombre, apellido, puesto, 
    fecha_nacimiento, iddepartamento, fecha_ingreso, foto, telefono, create_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let values = [
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    moment(fecha_nacimiento).format("YYYY-MM-DD"),
    iddepartamento,
    moment(fecha_ingreso).format("YYYY-MM-DD"),
    foto,
    telefono,
    create_date
  ];

  let query = mysql.format(insert, values);

  connection.query(query, (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(409).send({ message: "El empleado ya existe (DNI o código RRHH duplicado)." });
      } else if (err.errno === -4078 || !err.errno) {
        
        return res.status(500).send({ message: "Error al conectarse con la base de datos." });
      } else {
        console.log(err)
        return res.status(500).send({ message: "Error desconocido.", error: err });
      }
    }

    res.status(201).send({ message: "El Empleado fue creado con exito.", result });
  });
}

// Obtener todos los empleados
function getEmployees(req, res) {
  const sql = `
    SELECT 
      e.idempleados,
      e.identidad,
      e.rrh_codigo,
      e.nombre,
      e.apellido,
      e.puesto,
      e.fecha_nacimiento,
      e.fecha_ingreso,
      e.telefono,
      e.foto,
      d.iddepartamentos,
      d.departamento,
      e.create_date
    FROM empleados e
    LEFT JOIN departamentos d ON e.iddepartamento = d.iddepartamentos
    ORDER BY e.idempleados ASC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener los empleados.", error: err });
    }

    const baseUrl = req.protocol + "://" + req.get("host"); // ej: http://localhost:3308

    const empleadosFormateados = results.map(emp => ({
      ...emp,
      fecha_nacimiento: moment(emp.fecha_nacimiento).format("YYYY-MM-DD"),
      fecha_ingreso: moment(emp.fecha_ingreso).format("YYYY-MM-DD"),
      create_date: moment(emp.create_date).format("YYYY-MM-DD"),
      foto: emp.foto ? `${baseUrl}/uploads/empleados/${emp.foto}` : null
    }));

    res.status(200).json(empleadosFormateados);
  });
}

//actualizar Empleados
function updateEmployee(req, res) {
  const { idempleados } = req.params;

  const {
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    fecha_nacimiento,
    iddepartamento,
    fecha_ingreso,
    telefono
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  // Validaciones básicas
  if (!identidad || !rrh_codigo || !nombre || !apellido || !puesto || !fecha_nacimiento || !fecha_ingreso || !telefono || !iddepartamento) {
    console.log(req.body);
    return res.status(400).send({ message: "Todos los campos son obligatorios para actualizar." });
  }

  const sql = `
    UPDATE empleados SET
      identidad = ?,
      rrh_codigo = ?,
      nombre = ?,
      apellido = ?,
      puesto = ?,
      fecha_nacimiento = ?,
      iddepartamento = ?,
      fecha_ingreso = ?,
      telefono = ?,
      ${foto ? "foto = ?" : ""}
    WHERE idempleados = ?
  `;

  const formattedFechaNacimiento = moment(fecha_nacimiento).format("YYYY-MM-DD");
  const formattedFechaIngreso = moment(fecha_ingreso).format("YYYY-MM-DD");

  const values = [
    identidad,
    rrh_codigo,
    nombre,
    apellido,
    puesto,
    formattedFechaNacimiento,
    iddepartamento,
    formattedFechaIngreso,
    telefono,
    ...(foto ? [foto] : []),
    idempleados
  ];

  const query = mysql.format(sql, values);

  connection.query(query, (err, result) => {
    if (err) {
      console.log("Error al actualizar empleado:", err);
      return res.status(500).send({ message: "Error al actualizar el empleado.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    res.status(200).send({ message: "Empleado actualizado con éxito." });
  });
}


//eliminar Empleados
function deleteEmployee(req, res) {
  const { idempleados } = req.params;

  // 1. Buscar la foto del empleado
  const sqlGet = "SELECT foto FROM empleados WHERE idempleados = ?";
  const queryGet = mysql.format(sqlGet, [idempleados]);

  connection.query(queryGet, (err, result) => {
    if (err) {
      console.error("Error al buscar empleado:", err);
      return res.status(500).send({ message: "Error al buscar el empleado.", error: err });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    const nombreFoto = result[0].foto;

    // 2. Eliminar la foto del sistema de archivos si existe
    if (nombreFoto) {
      const rutaFoto = path.join(__dirname, "../uploads/empleados", nombreFoto);

      fs.unlink(rutaFoto, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.warn("⚠️ No se pudo eliminar la imagen:", unlinkErr.message);
        } else {
          console.log("🗑️ Imagen eliminada:", nombreFoto);
        }
      });
    }

    // 3. Eliminar el empleado
    const sqlDelete = "DELETE FROM empleados WHERE idempleados = ?";
    const queryDelete = mysql.format(sqlDelete, [idempleados]);

    connection.query(queryDelete, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error al eliminar empleado:", deleteErr);
        return res.status(500).send({ message: "Error al eliminar el empleado.", error: deleteErr });
      }

      res.status(200).send({ message: "Empleado eliminado con éxito." });
    });
  });
}

*/
module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getTechnicians,
  getapplicants
};
