const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestamoController');

router.get('/', controller.obtenerPrestamos);
router.get('/vencidos', controller.obtenerPrestamosVencidos);
router.post('/', controller.crearPrestamo);
router.put('/:id/devolver', controller.devolverLibro);

module.exports = router;