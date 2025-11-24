const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    identificacion: {
        type: String,
        required: [true, 'La identificación es obligatoria'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    telefono: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['Estudiante', 'Profesor', 'Administrativo', 'Público'],
        default: 'Estudiante'
    },
    prestamosActivos: {
        type: Number,
        default: 0,
        max: [3, 'No puede tener más de 3 préstamos activos']
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);