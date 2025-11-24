const Prestamo = require('../models/Prestamo');
const Libro = require('../models/Libro');
const Usuario = require('../models/Usuario');

exports.obtenerPrestamos = async (req, res) => {
    try {
        const { estado, page = 1, limit = 10 } = req.query;
        const filtro = estado ? { estado } : {};
        
        const prestamos = await Prestamo.find(filtro)
        .populate('usuario', 'nombre identificacion email')
        .populate('libro', 'titulo autor categoria')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ fechaPrestamo: -1 });
        
        const total = await Prestamo.countDocuments(filtro);
        
        res.json({
        prestamos,
        totalPaginas: Math.ceil(total / limit),
        paginaActual: Number(page),
        total
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener préstamos', error: error.message });
    }
};

exports.crearPrestamo = async (req, res) => {
    try {
        const { usuario, libro } = req.body;
        
        // Verificar que el usuario existe
        const usuarioDoc = await Usuario.findById(usuario);
        if (!usuarioDoc) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        // Verificar límite de préstamos
        if (usuarioDoc.prestamosActivos >= 3) {
        return res.status(400).json({ mensaje: 'El usuario ha alcanzado el límite de préstamos activos' });
        }
        
        // Verificar que el libro existe y está disponible
        const libroDoc = await Libro.findById(libro);
        if (!libroDoc) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        if (libroDoc.estado !== 'Disponible') {
        return res.status(400).json({ mensaje: 'El libro no está disponible' });
        }
        
        // Crear préstamo con fecha de devolución en 14 días
        const fechaDevolucion = new Date();
        fechaDevolucion.setDate(fechaDevolucion.getDate() + 14);
        
        const nuevoPrestamo = new Prestamo({
        usuario,
        libro,
        fechaDevolucion,
        ...req.body
    });
    
    await nuevoPrestamo.save();
    
    // Actualizar estado del libro
    libroDoc.estado = 'Prestado';
    await libroDoc.save();
    
    // Incrementar préstamos activos del usuario
    usuarioDoc.prestamosActivos += 1;
    await usuarioDoc.save();
    
    const prestamoCompleto = await Prestamo.findById(nuevoPrestamo._id)
        .populate('usuario', 'nombre identificacion')
        .populate('libro', 'titulo autor');
        
        res.status(201).json({ 
        mensaje: 'Préstamo creado exitosamente', 
        prestamo: prestamoCompleto 
        });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear préstamo', error: error.message });
    }
};

exports.devolverLibro = async (req, res) => {
    try {
        const prestamo = await Prestamo.findById(req.params.id)
        .populate('usuario')
        .populate('libro');
        
        if (!prestamo) {
        return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
        
        if (prestamo.estado === 'Devuelto') {
        return res.status(400).json({ mensaje: 'Este libro ya fue devuelto' });
    }
    
    // Actualizar préstamo
    prestamo.estado = 'Devuelto';
    prestamo.fechaDevueltoReal = new Date();
    await prestamo.save();
    
    // Actualizar estado del libro
    const libro = await Libro.findById(prestamo.libro._id);
    libro.estado = 'Disponible';
    await libro.save();
    
    // Decrementar préstamos activos del usuario
    const usuario = await Usuario.findById(prestamo.usuario._id);
    usuario.prestamosActivos -= 1;
    await usuario.save();
    
    res.json({ 
        mensaje: 'Libro devuelto exitosamente', 
        prestamo,
        diasRetraso: prestamo.diasRetraso()
        });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al devolver libro', error: error.message });
    }
};

exports.obtenerPrestamosVencidos = async (req, res) => {
    try {
        const hoy = new Date();
        const prestamos = await Prestamo.find({
        estado: 'Activo',
        fechaDevolucion: { $lt: hoy }
        })
        .populate('usuario', 'nombre email telefono')
        .populate('libro', 'titulo autor');
        
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener préstamos vencidos', error: error.message });
    }
};