const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres']
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Literatura', 'Clásicos', 'Ficción', 'Infantil', 'Fantasía', 'Ciencia', 'Historia', 'Otro']
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Prestado', 'Mantenimiento'],
        default: 'Disponible'
    },
    ubicacion: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('Libro', LibroSchema);