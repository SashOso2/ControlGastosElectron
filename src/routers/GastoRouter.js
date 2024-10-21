const express = require('express');
const model = require("./../models/GastoModel");

const router = express.Router();
const url='/api/gastos';

// Lista
router.get(url, async (req, res) => {
    try {
        const lista = await model.Lista();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista', error });
    }
});

// Buscar
router.get(`${url}/:id`, async (req, res) => {
    const id = req.params.id;
    try {
        const obj = await model.Buscar(id);
        if (obj) {
            res.json(obj);
        } else {
            res.status(404).json({ message: 'No encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar', error });
    }
});

// Agregar
router.post(url, async (req, res) => {
    const obj = req.body;
    try {
        await model.Agregar(obj);
        res.status(201).json({ message: 'Creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear', error });
    }
});

// Actualizar
router.put(url, async (req, res) => {
    const obj = req.body;
    try {
        await model.Actualizar(obj);
        res.json({ message: 'Actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar', error });
    }
});

// Eliminar
router.delete(`${url}/:id`, async (req, res) => {
    const id = req.params.id;
    try {
        await model.Eliminar(id);
        res.json({ message: `Eliminado` });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar', error });
    }
});

module.exports = router;
