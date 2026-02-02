select * from usuarios

select * from empleados where idusuarios = 6

SELECT * FROM departamentos order by iddepartamentos asc

delete from usuarios where idusuarios = 6

update empleados set nombre="sergios123" where idusuarios = 8


SELECT 
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
INNER JOIN usuarios u ON e.idusuarios = u.idusuarios
INNER JOIN departamentos d ON e.iddepartamento = d.iddepartamentos;


SELECT 
      i.idinventario, i.codigo_auditoria, i.service_tag, i.nombre_activo,
      i.descripcion, i.marca, i.modelo, i.serie,
      i.fecha_ingreso, i.valor,
      c.idcategoria, c.categoria,
      COUNT(*) OVER () AS total_registros
    FROM inventario i
    JOIN categorias c ON i.id_categoria = c.idcategoria
    ORDER BY i.idinventario ASC



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
    
    
    SELECT 
    i.idinventario,
    i.codigo_auditoria,
    i.service_tag,
    i.nombre_activo,
    i.descripcion,
    i.marca,
    i.modelo,
    i.serie,
    i.fecha_ingreso,
    i.valor,
    i.estado,
    c.idcategoria,
    c.categoria,
    ROW_NUMBER() OVER (ORDER BY i.idinventario) AS total_registros
FROM inventario i
LEFT JOIN asignaciones_detalle ad ON ad.idinventario = i.idinventario
LEFT JOIN devoluciones d ON d.idasignaciones = ad.idasignaciones AND d.estado_activo = 'DISPONIBLE'
JOIN categorias c ON i.id_categoria = c.idcategoria
WHERE ad.id IS NULL OR d.iddevoluciones IS NOT NULL
ORDER BY i.idinventario ASC;