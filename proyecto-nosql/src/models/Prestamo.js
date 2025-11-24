const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    libro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        required: true
    },
    fechaPrestamo: {
        type: Date,
        default: Date.now
    },
    fechaDevolucion: {
        type: Date,
        required: true
    },
    fechaDevueltoReal: {
        type: Date
    },
    estado: {
        type: String,
        enum: ['Activo', 'Devuelto', 'Vencido'],
        default: 'Activo'
    },
    observaciones: {
        type: String
    }
});

// Método para calcular días de retraso
PrestamoSchema.methods.diasRetraso = function() {
    if (this.estado === 'Devuelto') return 0;
    const hoy = new Date();
    const diferencia = hoy - this.fechaDevolucion;
  return Math.max(0, Math.floor(diferencia / (1000 * 60 * 60 * 24)));
};

module.exports = mongoose.model('Prestamo', PrestamoSchema);