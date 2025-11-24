require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB - BibliotecaDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/libros', require('./src/routes/libroRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/prestamos', require('./src/routes/prestamoRoutes'));

// Ruta raíz
app.get('/api', (req, res) => {
    res.json({ 
        mensaje: '📚 API de Biblioteca funcionando',
        endpoints: {
        libros: '/api/libros',
        usuarios: '/api/usuarios',
        prestamos: '/api/prestamos'
        }
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
