const db = require('./BaseDatos');

const tabla = "categoria_gasto";

// Lista todos los registros de la tabla fuente_ingreso
async function Lista() {
    return new Promise((resolve, reject) => {
        const tabla_grupo="grupo_gasto";
        const sql = `
            SELECT 
                t.id,
                t.nombre,
                t.grupo_id AS grupo_id,
                g.nombre AS grupo_nombre
            FROM 
                ${tabla} t
            JOIN 
                ${tabla_grupo} g ON t.grupo_id = g.id;
        `;
        db.all(sql, [], (error, rows) => {
            if (error) {
                console.error('Error al listar registros:', error);
                return reject(new Error('No se pudieron listar los registros.'));
            }
            const lista = rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                grupo:{
                    id: row.grupo_id,
                    nombre: row.grupo_nombre,
                }
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
        const sql = `INSERT INTO ${tabla} (nombre, grupo_id) VALUES (?, ?)`; // Asegúrate de que 'grupo_i' es el nombre correcto
        db.run(sql, [obj.nombre, obj.grupo.id], function (error) {
            if (error) {
                console.error('Error al agregar registro:', error);
                return reject(new Error('No se pudo agregar el registro.'));
            }
            resolve({ id: this.lastID, nombre: obj.nombre, grupo: obj.grupo }); // Corregido aquí
        });
    });
}

// Actualiza un registro existente
async function Actualizar(obj) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ${tabla} SET nombre = ?, grupo_id = ? WHERE id = ?`; // Asegúrate de que 'grupo_i' es el nombre correcto
        db.run(sql, [obj.nombre, obj.grupo.id, obj.id], function (error) {
            if (error) {
                console.error('Error al actualizar registro:', error);
                return resolve(null);
            }
            resolve({ id: obj.id, nombre: obj.nombre, grupo: obj.grupo }); // Asegúrate de referenciar correctamente 'obj.grupo'
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
                return resolve(null);
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