const jwt = require('../service/jwt');
const moment = require('moment');
const {connection} = require('../database/config.db');
const mysql = require('mysql');

function getAssignments(req, res) {
  const sql = `
    SELECT 
      e.idempleados, 
      e.nombre, 
      e.apellido, 
      d.iddepartamentos,
      d.departamento,
      a.idasignaciones,
      a.fecha_asignacion,
      a.observaciones,
      a.asignado_por,
      a.mouse,
      a.mochila,
      teclado,
      ROW_NUMBER() OVER (ORDER BY e.idempleados) AS total_registros
    FROM empleados e
    JOIN departamentos d ON e.iddepartamento = d.iddepartamentos 
    JOIN asignaciones a ON e.idempleados = a.idempleado 
    ORDER BY e.idempleados
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener todas las asignaciones.", error: err });
    }

    const ids = results.map(row => row.idasignaciones);
    if (ids.length === 0) return res.status(200).json([]);

    const sqlDetalles = `
      SELECT 
        a.idasignaciones,
        ad.id,
        ad.nuevo_usado,
        i.idinventario,
        i.codigo_auditoria,
        i.service_tag,
        i.nombre_activo,
        i.marca,
        i.modelo,
        i.valor,
        c.categoria
      FROM asignaciones a
      JOIN asignaciones_detalle ad ON a.idasignaciones = ad.idasignaciones
      JOIN inventario i ON ad.idinventario = i.idinventario
      JOIN categorias c ON i.id_categoria = c.idcategoria
      WHERE a.idasignaciones IN (?)
      ORDER BY a.idasignaciones;
    `;

    connection.query(sqlDetalles, [ids], (err2, detalles) => {
      if (err2) {
        return res.status(500).send({ message: "Error al obtener detalles de equipos.", error: err2 });
      }

      // Agrupar detalles por idasignaciones
      const detallesPorAsignacion = {};
      detalles.forEach((item) => {
        if (!detallesPorAsignacion[item.idasignaciones]) {
          detallesPorAsignacion[item.idasignaciones] = [];
        }
        detallesPorAsignacion[item.idasignaciones].push(item);
      });

      // Combinar asignaciones con sus detalles
      const data = results.map((row) => ({
        ...row,
        fecha_asignacion: moment(row.fecha_asignacion).format("YYYY-MM-DD"),
        equipos: detallesPorAsignacion[row.idasignaciones] || []
      }));

      res.status(200).json(data);
    });
  });
}

function getUserAssignmentsById(req, res) {
  const { id } = req.params; // el idusuario viene por la URL

  const sql = `
    SELECT 
        u.idusuarios,
        u.correo,
        u.descripcion,
        u.tipo_usuario,
        u.estado,
        u.fecha_creacion,
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
        d.departamento
    FROM usuarios u
    INNER JOIN empleados e ON u.idusuarios = e.idusuarios
    LEFT JOIN departamentos d ON e.iddepartamento = d.iddepartamentos
    WHERE u.idusuarios = ?;
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener asignaciones", error: err });
    }

    res.status(200).send({
      message: "Asignaciones del usuario obtenidas con éxito",
      total: results.length,
      data: results
    });
  });
}

function createAsigment(req, res) {
  const { idempleado, asignado_por, Observaciones, mouse, mochila, teclado, equipos } = req.body;
  const fecha_asignacion = moment().format("YYYY-MM-DD HH:mm:ss");

  if (!idempleado || !asignado_por || !fecha_asignacion || !equipos || equipos.length === 0) {
    return res.status(400).send({ message: "Faltan datos o no hay activos seleccionados." });
  }

  // Insertar en la tabla asignaciones (encabezado)
  const insertAsignacion = `
    INSERT INTO asignaciones (idempleado, asignado_por, fecha_asignacion, observaciones, mouse, mochila, teclado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(insertAsignacion, [idempleado, asignado_por, fecha_asignacion, Observaciones, mouse, mochila, teclado], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Error al registrar la asignación.", error: err });
    }

    const idasignacion = result.insertId; // ID de la nueva asignación

    // Insertar los detalles (activos asignados con nuevo_usado)
    const insertDetalle = `
      INSERT INTO asignaciones_detalle (idasignaciones, idinventario, nuevo_usado)
      VALUES ?
    `;

    const detalleValues = equipos.map(eq => [idasignacion, eq.idinventario, eq.nuevo_usado]);

    connection.query(insertDetalle, [detalleValues], (err) => {
      if (err) {
                
        return res.status(500).send({ message: "Error al registrar el detalle de asignación.", error: err });
      }

      // Actualizar estado de los activos a "ASIGNADO"
      const updateInventario = `
        UPDATE inventario SET estado = 'ASIGNADO'
        WHERE idinventario IN (?)
      `;

      const idsInventario = equipos.map(eq => eq.idinventario);

      connection.query(updateInventario, [idsInventario], (err) => {
        if (err) {
          return res.status(500).send({ message: "Error al actualizar estado de inventario.", error: err });
        }

        return res.status(201).send({
          message: "Asignación creada con éxito.",
          idasignacion,
          activos_asignados: equipos
        });
      });
    });
  });
}

function deleteAsigment(req, res) {
  const { idasignaciones } = req.params;

  if (!idasignaciones) {
    return res.status(400).send({ message: "Se requiere el ID de la asignación a eliminar." });
  }

  // 1. Obtener los IDs de inventario asociados para actualizar su estado
  const getInventarioIds = `
    SELECT idinventario
    FROM asignaciones_detalle
    WHERE idasignaciones = ?
  `;

  connection.query(getInventarioIds, [idasignaciones], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error al obtener inventario de la asignación.", error: err });
    }

    const inventarioIds = results.map(r => r.idinventario);

    // 2. Eliminar los detalles de la asignación
    const deleteDetalles = `
      DELETE FROM asignaciones_detalle
      WHERE idasignaciones = ?
    `;

    connection.query(deleteDetalles, [idasignaciones], (err) => {
      if (err) {
        return res.status(500).send({ message: "Error al eliminar detalles de la asignación.", error: err });
      }

      // 3. Eliminar la asignación
      const deleteAsignacion = `
        DELETE FROM asignaciones
        WHERE idasignaciones = ?
      `;

      connection.query(deleteAsignacion, [idasignaciones], (err) => {
        if (err) {
          return res.status(500).send({ message: "Error al eliminar la asignación.", error: err });
        }

        // 4. Actualizar el estado de los equipos a "DISPONIBLE"
        if (inventarioIds.length > 0) {
          const updateInventario = `
            UPDATE inventario
            SET estado = 'DISPONIBLE'
            WHERE idinventario IN (?)
          `;
          connection.query(updateInventario, [inventarioIds], (err) => {
            if (err) {
              return res.status(500).send({ message: "Error al actualizar estado de inventario.", error: err });
            }

            return res.status(200).send({ message: "Asignación y detalles eliminados con éxito." });
          });
        } else {
          // No había inventario asociado
          return res.status(200).send({ message: "Asignación eliminada, sin inventario asociado." });
        }
      });
    });
  });
}

module.exports = {
  getUserAssignmentsById,
  createAsigment,
  getAssignments,
  deleteAsigment
}