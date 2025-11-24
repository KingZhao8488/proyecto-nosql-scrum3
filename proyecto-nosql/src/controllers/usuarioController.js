const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const { tipo, page = 1, limit = 10 } = req.query;
        const filtro = tipo ? { tipo } : {};
        
        const usuarios = await Usuario.find(filtro)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ nombre: 1 });
        
        const total = await Usuario.countDocuments(filtro);
        
        res.json({
        usuarios,
        totalPaginas: Math.ceil(total / limit),
        paginaActual: Number(page),
        total
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
};

exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );
        if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario actualizado', usuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        if (usuario.prestamosActivos > 0) {
        return res.status(400).json({ mensaje: 'No se puede eliminar un usuario con préstamos activos' });
        }
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
    }
};