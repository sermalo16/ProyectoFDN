const jwt = require('../service/jwt');
const moment = require('moment');
const {connection} = require('../database/config.db');
const mysql = require('mysql');

function getAssignments(req, res) {

  const sqlAsignaciones = `
    SELECT 
      a.idasignacion,
      a.fecha_asignacion,
      a.observaciones,
      a.estado,

      emp.idempleados AS id_empleado,
      emp.nombre AS nombre_empleado,
      emp.apellido AS apellido_empleado,

      asignador.idempleados AS id_asignador,
      asignador.nombre AS nombre_asignador,
      asignador.apellido AS apellido_asignador,

      d.departamento,
      em.nombreEmpresa

    FROM asignaciones a

    INNER JOIN empleados emp 
      ON a.idempleado = emp.idempleados

    INNER JOIN empleados asignador 
      ON a.asignado_por = asignador.idempleados

    INNER JOIN empresa_departamento ed
      ON emp.id_empresa_departamento = ed.id
      
    INNER JOIN departamentos d
      ON d.iddepartamentos = ed.id_departamento
      
    INNER JOIN empresas em
      ON em.idEmpresa = ed.id_empresa

    ORDER BY a.idasignacion DESC
  `;

  connection.query(sqlAsignaciones, (err, asignaciones) => {

    if (err) {
      return res.status(500).json({
        message: "Error al obtener asignaciones",
        error: err
      });
    }

    if (asignaciones.length === 0) {
      return res.json([]);
    }

    const ids = asignaciones.map(a => a.idasignacion);

    const sqlDetalles = `
      SELECT 
        ad.iddetalle,
        ad.idasignacion,
        ad.nuevo_usado,
        ad.estado AS estado_detalle,

        i.idinventario,
        i.codigo_auditoria,
        i.service_tag,
        i.nombre_activo,
        i.marca,
        i.modelo,
        i.valor

      FROM asignacion_detalle ad

      INNER JOIN inventario i 
        ON ad.idinventario = i.idinventario

      WHERE ad.idasignacion IN (?)
      ORDER BY ad.idasignacion
    `;

    connection.query(sqlDetalles, [ids], (err2, detalles) => {

      if (err2) {
        return res.status(500).json({
          message: "Error al obtener detalle de asignaciones",
          error: err2
        });
      }

      // Agrupar detalles por asignación
      const detallesPorAsignacion = {};

      detalles.forEach(det => {

        if (!detallesPorAsignacion[det.idasignacion]) {
          detallesPorAsignacion[det.idasignacion] = [];
        }

        detallesPorAsignacion[det.idasignacion].push(det);

      });

      const data = asignaciones.map(asignacion => ({

        ...asignacion,

        equipos: detallesPorAsignacion[asignacion.idasignacion] || []

      }));

      res.json(data);

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

  const { idempleado, asignado_por, observaciones, equipos } = req.body;

  const fecha_asignacion = moment().format("YYYY-MM-DD HH:mm:ss");

  if (!idempleado || !asignado_por || !equipos || equipos.length === 0) {
    return res.status(400).json({
      message: "Faltan datos o no hay activos seleccionados."
    });
  }

  connection.beginTransaction(err => {

    if (err) {
      return res.status(500).json({ message: "Error iniciando transacción", error: err });
    }

    const insertAsignacion = `
      INSERT INTO asignaciones 
      (idempleado, asignado_por, fecha_asignacion, observaciones, estado)
      VALUES (?, ?, ?, ?, 'ACTIVA')
    `;

    connection.query(
      insertAsignacion,
      [idempleado, asignado_por, fecha_asignacion, observaciones],
      (err, result) => {

        if (err) {
          return connection.rollback(() => {
            res.status(500).json({
              message: "Error al registrar la asignación",
              error: err
            });
          });
        }

        const idasignacion = result.insertId;

        const insertDetalle = `
          INSERT INTO asignacion_detalle
          (idasignacion, idinventario, nuevo_usado, estado)
          VALUES ?
        `;

        const detalleValues = equipos.map(eq => [
          idasignacion,
          eq.idinventario,
          eq.nuevo_usado,
          "ASIGNADO"
        ]);

        connection.query(insertDetalle, [detalleValues], err => {

          if (err) {
            return connection.rollback(() => {
              res.status(500).json({
                message: "Error al registrar detalle de asignación",
                error: err
              });
            });
          }

          const idsInventario = equipos.map(eq => eq.idinventario);

          const updateInventario = `
            UPDATE inventario 
            SET estado = 'ASIGNADO'
            WHERE idinventario IN (?)
          `;

          connection.query(updateInventario, [idsInventario], err => {

            if (err) {
              return connection.rollback(() => {
                res.status(500).json({
                  message: "Error al actualizar inventario",
                  error: err
                });
              });
            }

            connection.commit(err => {

              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({
                    message: "Error al confirmar transacción",
                    error: err
                  });
                });
              }

              res.status(201).json({
                message: "Asignación creada correctamente",
                idasignacion,
                equipos
              });

            });

          });

        });

      }
    );

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