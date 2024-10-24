const express = require('express');
const controller = require("../controllers/IngresoController");

const router = express.Router();
const url='/api/ingresos';

router.get(url, controller.lista);
router.get(`${url}/:id`, controller.buscar);
router.post(url, controller.agregar);
router.put(url, controller.actualizar);
router.delete(`${url}/:id`, controller.eliminar);

module.exports = router;
