const express = require('express');
const router = express.Router();
const controller = require('../controllers/libroController');

router.get('/', controller.obtenerLibros);
router.get('/buscar', controller.buscarPorTitulo);
router.get('/:id', controller.obtenerLibroPorId);
router.post('/', controller.crearLibro);
router.put('/:id', controller.actualizarLibro);
router.delete('/:id', controller.eliminarLibro);

module.exports = router;