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

      d.departamento

    FROM asignaciones a

    INNER JOIN empleados emp 
      ON a.idempleado = emp.idempleados

    INNER JOIN empleados asignador 
      ON a.asignado_por = asignador.idempleados

    INNER JOIN empresa_departamento ed
      ON emp.id_empresa_departamento = ed.id
      
      inner join departamentos d
      on d.iddepartamentos = ed.id_departamento
      
      inner join empresas em 
      on em.idEmpresa = ed.id_empresa

    ORDER BY a.idasignacion DESC
      
      


