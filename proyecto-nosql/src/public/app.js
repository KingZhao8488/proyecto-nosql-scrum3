import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productosRoutes from "./routes/productos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("❌ Error de conexión:", err));

    // Middleware
    app.use(express.json());
    app.use(express.static(path.resolve("public")));

    // Rutas API
    app.use("/api/productos", productosRoutes);

    // Iniciar servidor
    app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

