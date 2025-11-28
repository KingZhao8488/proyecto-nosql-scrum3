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
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Conectado a MongoDB - BibliotecaDB');
        console.log('📊 Base de datos:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err);
        process.exit(1); // Salir si no hay conexión
    });

// Manejar eventos de la conexión
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});

// Rutas
app.use('/api/libros', require('./src/routes/libroRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/prestamos', require('./src/routes/prestamoRoutes'));

// Ruta raíz
app.get('/api', (req, res) => {
    res.json({ 
        mensaje: '📚 API de Biblioteca funcionando',
        database: mongoose.connection.name,
        estado: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
        endpoints: {
            libros: '/api/libros',
            usuarios: '/api/usuarios',
            prestamos: '/api/prestamos'
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Prueba la API en http://localhost:${PORT}/api`);
});
