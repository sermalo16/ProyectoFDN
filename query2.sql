/*inventario disponiple*/
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
    COUNT(*) OVER () AS total_registros
FROM inventario i
LEFT JOIN asignaciones_detalle ad ON ad.idinventario = i.idinventario
LEFT JOIN devoluciones d ON d.idasignaciones = ad.idasignaciones AND d.estado_activo = 'DISPONIBLE'
JOIN categorias c ON i.id_categoria = c.idcategoria
WHERE ad.id IS NULL OR d.iddevoluciones IS NOT NULL
ORDER BY i.idinventario ASC;


/*no disponiple, asignado*/
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
    c.idcategoria,
    c.categoria,
    d.iddepartamentos,
    d.departamento,
    COUNT(*) OVER () AS total_registros,
    COUNT(*) OVER (PARTITION BY d.iddepartamentos) AS total_por_departamento
FROM inventario i
JOIN categorias c ON i.id_categoria = c.idcategoria
JOIN asignaciones_detalle ad ON ad.idinventario = i.idinventario
JOIN asignaciones a ON a.idasignaciones = ad.idasignaciones
JOIN empleados e ON a.idempleado = e.idempleados
JOIN departamentos d ON d.iddepartamentos = e.iddepartamento
ORDER BY d.departamento, i.idinventario ASC;



/*Asignaciones*/
SELECT 
e.idempleados, 
e.nombre, 
e.apellido, 
d.iddepartamentos,
d.departamento,
a.idasignaciones,
a.fecha_asignacion,
a.observaciones,
a.asignado_por 
from empleados e join departamentos d on e.iddepartamento = d.iddepartamentos 
join asignaciones a on e.idempleados = a.idempleado 
order by e.idempleados;

select ad.id, i.idinventario, i.codigo_auditoria, i.service_tag, i.nombre_activo, i.marca, i.modelo, i.valor, c.categoria from asignaciones a 
join asignaciones_detalle ad on a.idasignaciones = ad.idasignaciones
join inventario i on ad.idinventario = i.idinventario
join categorias c on i.id_categoria = c.idcategoria
where a.idasignaciones = 1 
order by a.idasignaciones;

/*Activos por usuarios*/

