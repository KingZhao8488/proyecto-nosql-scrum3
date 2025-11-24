const Libro = require('../models/Libro');

// Obtener todos los libros con filtros y paginación
exports.obtenerLibros = async (req, res) => {
    try {
        const { categoria, estado, autor, page = 1, limit = 10 } = req.query;
        
        const filtro = {};
        if (categoria) filtro.categoria = categoria;
        if (estado) filtro.estado = estado;
        if (autor) filtro.autor = new RegExp(autor, 'i');
        
        const libros = await Libro.find(filtro)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ titulo: 1 });
        
        const total = await Libro.countDocuments(filtro);
        
        res.json({
        libros,
        totalPaginas: Math.ceil(total / limit),
        paginaActual: Number(page),
        total
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener libros', error: error.message });
    }
};

// Obtener libro por ID
exports.obtenerLibroPorId = async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json(libro);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener libro', error: error.message });
    }
};

// Crear nuevo libro
exports.crearLibro = async (req, res) => {
    try {
        const nuevoLibro = new Libro(req.body);
        await nuevoLibro.save();
        res.status(201).json({ mensaje: 'Libro creado exitosamente', libro: nuevoLibro });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear libro', error: error.message });
    }
};

// Actualizar libro
exports.actualizarLibro = async (req, res) => {
    try {
        const libro = await Libro.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );
        if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro actualizado', libro });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar libro', error: error.message });
    }
};

// Eliminar libro
exports.eliminarLibro = async (req, res) => {
    try {
        const libro = await Libro.findByIdAndDelete(req.params.id);
        if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar libro', error: error.message });
    }
};

// Buscar libros por título
exports.buscarPorTitulo = async (req, res) => {
    try {
        const { titulo } = req.query;
        const libros = await Libro.find({
        titulo: new RegExp(titulo, 'i')
        });
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en búsqueda', error: error.message });
    }
};