const db = require('./BaseDatos');

const tabla = "grupo_gasto";

// Lista todos los registros de la tabla fuente_ingreso
async function Lista() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ${tabla}`;
        db.all(sql, [], (error, rows) => {
            if (error) {
                console.error('Error al listar registros:', error);
                return reject(new Error('No se pudieron listar los registros.'));
            }
            resolve(rows);
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
        const sql = `INSERT INTO ${tabla} (nombre) VALUES (?)`;
        db.run(sql, [obj.nombre], function (error) {
            if (error) {
                console.error('Error al agregar registro:', error);
                return resolve(null);
            }
            resolve({ id: this.lastID, nombre: obj.nombre });
        });
    });
}

// Actualiza un registro existente
async function Actualizar(obj) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ${tabla} SET nombre = ? WHERE id = ?`;
        db.run(sql, [obj.nombre, obj.id], function (error) {
            if (error) {
                console.error('Error al actualizar registro:', error);
                return resolve(null);
            }
            resolve({ id: obj.id, nombre: obj.nombre });
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