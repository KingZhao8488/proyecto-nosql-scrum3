import mongoose from "mongoose";

const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    autor: {
        type: String,
        required: true,
        min: 0
    },
    categoria: {
        type: String,
        default: 0,
        min: 0
    },
    estado: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true

    }
});

module.exports = mongoose.model('Producto', ProductoSchema);
