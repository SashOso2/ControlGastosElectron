const model = require("../models/GastoModel");

// Lista
module.exports.lista= async (req, res) => {
    try {
        const lista = await model.lista();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista', error });
    }
}
// Buscar
module.exports.buscar= async (req, res) => {
    const id = req.params.id;
    try {
        const obj = await model.buscar(id);
        if (obj) {
            res.json(obj);
        } else {
            res.status(404).json({ message: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar', error });
    }
}
// Agregar
module.exports.agregar= async (req, res) => {
    const obj = req.body;
    try {
        await model.agregar(obj);
        res.status(201).json(obj);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear', error });
    }
}
// Actualizar
module.exports.actualizar= async (req, res) => {
    const obj = req.body;
    try {
        await model.actualizar(obj);
        res.json(obj);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar', error });
    }
}
// Eliminar
module.exports.eliminar= async (req, res) => {
    const id = req.params.id;
    try {
        await model.eliminar(id);
        res.json({ message: `Eliminado` });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar', error });
    }
}