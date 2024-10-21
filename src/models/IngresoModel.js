const db = require('./BaseDatos');

const tabla = "ingreso";

// Lista todos los registros de la tabla fuente_ingreso
async function Lista() {
    return new Promise((resolve, reject) => {
        const tabla_fuente="fuente_ingreso";
        const sql = `
            SELECT 
                t.id,
                t.fecha,
                t.fuente_id AS fuente_id,
                f.nombre AS fuente_nombre,
                t.observacion,
                t.monto
            FROM 
                ${tabla} t 
            JOIN 
                ${tabla_fuente} f ON t.fuente_id = f.id;
        `;
        db.all(sql, [], (error, rows) => {
            if (error) {
                console.error('Error al listar registros:', error);
                return reject(new Error('No se pudieron listar los registros.'));
            }
            const lista = rows.map(row => ({
                id: row.id,
                fecha: row.fecha,
                fuente:{
                    id: row.fuente_id,
                    nombre: row.fuente_nombre,
                },
                observacion: row.observacion,
                monto: row.monto
            }));

            resolve(lista);
        });
    });
}

// Busca un registro por ID
async function Buscar(id) {
    const lista = await Lista();
    return lista.find(item => item.id === Number(id));
}
// Agrega un nuevo registro
async function Agregar(obj) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ${tabla} (fecha, fuente_id, observacion, monto) VALUES (?, ?, ?, ?)`;
        db.run(sql, [obj.fecha, obj.fuente.id, obj.observacion, obj.monto], function (error) {
            if (error) {
                console.error('Error al agregar registro:', error);
                return resolve(null);
            }
            resolve({ id: this.lastID, fecha: obj.fecha, fuente: obj.fuente, observacion: obj.observacion, monto: obj.monto });
        });
    });
}

// Actualiza un registro existente
async function Actualizar(obj) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ${tabla} SET fecha = ?, fuente_id = ?, observacion = ?, monto = ? WHERE id = ?`;
        db.run(sql, [obj.fecha, obj.fuente.id, obj.observacion, obj.monto, obj.id], function (error) {
            if (error) {
                console.error('Error al actualizar registro:', error);
                return resolve(null);
            }
            resolve({ id: obj.id, fecha: obj.fecha, fuente: obj.fuente, observacion: obj.observacion, monto: obj.monto });
        });
    });
}

// Elimina un registro por ID
async function Eliminar(id) {
    return new Promise((resolve, reject) => {
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

module.exports = {
    Lista,
    Buscar,
    Agregar,
    Actualizar,
    Eliminar
};