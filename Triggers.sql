#triggers para dar de baja a un activo en el inventario
DELIMITER $$

CREATE TRIGGER trg_baja_inventario
AFTER INSERT ON inventario_defectuoso
FOR EACH ROW
BEGIN
    UPDATE inventario
    SET estado = 'baja'
    WHERE idinventario = NEW.idinventario;
END$$

DELIMITER ;


#nuevos triggers
