const db = require('./BaseDatos');

const tabla = "gasto";

module.exports.lista= async ()=>{
    return new Promise((resolve, reject) => {
        const tabla_grupo="grupo_gasto";
        const tabla_categoria="categoria_gasto";
        const sql = `
            SELECT 
                t.id,
                t.fecha,
                g.id AS grupo_id,
                g.nombre AS grupo_nombre,
                c.id AS categoria_id,
                c.nombre AS categoria_nombre,
                t.observacion,
                t.monto
            FROM 
                ${tabla} t
            JOIN 
                ${tabla_categoria} c ON t.categoria_id = c.id
            JOIN 
                ${tabla_grupo} g ON c.grupo_id = g.id
            ORDER BY 
                t.fecha DESC,
                t.id DESC;

        `;
        db.all(sql, [], (error, rows) => {
            if (error) {
                console.error('Error al listar registros:', error);
                return reject(new Error('No se pudieron listar los registros.'));
            }
            const lista = rows.map(row => ({
                id: row.id,
                fecha: row.fecha,
                categoria:{
                    id: row.categoria_id,
                    nombre: row.categoria_nombre,
                    grupo:{
                        id: row.grupo_id,
                        nombre: row.grupo_nombre,
                    }
                },
                observacion: row.observacion,
                monto: row.monto
            }));

            resolve(lista);
        });
    });
}
module.exports.buscar=async (id)=>{
    const lista = await this.lista();
    return lista.find(item => item.id === Number(id)) || null;
}
module.exports.agregar=async (obj)=>{
    return new Promise((resolve) => {
        const sql = `INSERT INTO ${tabla} (fecha, categoria_id, observacion, monto) VALUES (?, ?, ?, ?)`;
        db.run(sql, [obj.fecha, obj.categoria.id, obj.observacion, obj.monto], function (error) {
            if (error) {
                console.error('Error al agregar registro:', error);
                return reject(new Error('No se pudo agregar el registro.'));
            }
            obj.id=this.lastID;
            resolve(obj);
        });
    });
}
module.exports.actualizar=async (obj)=>{
    return new Promise(async(resolve) => {
        if (!await this.buscar(obj.id))  return reject(new Error('El registro no existe.'));

        const sql = `UPDATE ${tabla} SET fecha = ?, categoria_id = ?, observacion = ?, monto = ? WHERE id = ?`;
        db.run(sql, [obj.fecha, obj.categoria.id, obj.observacion, obj.monto, obj.id], function (error) {
            if (error) {
                console.error('Error al actualizar registro:', error);
                return reject(new Error('No se pudo actualizar el registro.'));
            }
            resolve(obj);
        });
    });
}
module.exports.eliminar=async (id)=>{
    return new Promise(async(resolve, reject) => {
        if (!await this.buscar(id))  return reject(new Error('El registro no existe.'));

        const sql = `DELETE FROM ${tabla} WHERE id = ?`;
        db.run(sql, [id], function (error) {
            if (error) {
                console.error('Error al eliminar registro:', error);
                return reject(new Error('No se pudo eliminar el registro.'));
            }
            resolve(true);
        });
    });
}