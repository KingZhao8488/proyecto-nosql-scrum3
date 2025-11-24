const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.get('/', controller.obtenerUsuarios);
router.get('/:id', controller.obtenerUsuarioPorId);
router.post('/', controller.crearUsuario);
router.put('/:id', controller.actualizarUsuario);
router.delete('/:id', controller.eliminarUsuario);

module.exports = router;