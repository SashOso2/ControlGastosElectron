const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const os = require('os');
const ruta_base_datos = path.join(os.homedir(), 'Documents', 'control_gastos.db');

const db = new sqlite3.Database(ruta_base_datos, (error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    } else {
        crearTablas();
    }
});

function crearTablas() {
    const sqlFuenteIngreso = `
        CREATE TABLE IF NOT EXISTS fuente_ingreso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )
    `;

    const sqlGrupoGasto = `
        CREATE TABLE IF NOT EXISTS grupo_gasto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )
    `;

    const sqlCategoriaGasto = `
        CREATE TABLE IF NOT EXISTS categoria_gasto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grupo_id INTEGER,
            nombre TEXT NOT NULL,
            FOREIGN KEY (grupo_id) REFERENCES grupo_gasto(id)
        )
    `;

    const sqlGasto = `
        CREATE TABLE IF NOT EXISTS gasto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            categoria_id INTEGER,
            observacion TEXT,
            monto REAL NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES categoria_gasto(id)
        )
    `;

    const sqlIngreso = `
        CREATE TABLE IF NOT EXISTS ingreso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            fuente_id INTEGER,
            observacion TEXT,
            monto REAL NOT NULL,
            FOREIGN KEY (fuente_id) REFERENCES fuente_ingreso(id)
        )
    `;
    const sqlUsuario = `
        CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `;

    // Ejecuta las consultas para crear las tablas
    db.run(sqlFuenteIngreso, (error) => {
        if (error) {
            console.error('Error al crear la tabla fuente_ingreso:', error.message);
        }
    });

    db.run(sqlGrupoGasto, (error) => {
        if (error) {
            console.error('Error al crear la tabla grupo_gasto:', error.message);
        }
    });

    db.run(sqlCategoriaGasto, (error) => {
        if (error) {
            console.error('Error al crear la tabla categoria_gasto:', error.message);
        }
    });

    db.run(sqlGasto, (error) => {
        if (error) {
            console.error('Error al crear la tabla gasto:', error.message);
        }
    });

    db.run(sqlIngreso, (error) => {
        if (error) {
            console.error('Error al crear la tabla ingreso:', error.message);
        }
    });
    db.run(sqlUsuario, (error) => {
        if (error) {
            console.error('Error al crear la tabla usuario:', error.message);
        }else{
            agregarSuperUsuario()
        }
    });
}
function agregarSuperUsuario() {
    const username = 'admin';
    const password = 'admin';
    const nombre ="Administrador"

    const sqlCheckSuperUser = `
        SELECT COUNT(*) AS count FROM usuario WHERE username = ?
    `;

    db.get(sqlCheckSuperUser, [username], (error, row) => {
        if (error) {
            console.error('Error al verificar superusuario:', error.message);
            return;
        }

        if (row.count === 0) {
            const sqlInsertSuperUser = `
                INSERT INTO usuario (nombre, username, password) VALUES (?, ?, ?)
            `;

            db.run(sqlInsertSuperUser, [nombre, username, password], function (error) {
                if (error) {
                    console.error('Error al crear superusuario:', error.message);
                } else {
                    console.log('Superusuario creado exitosamente.');
                }
            });
        }
    });
}
module.exports = db;
