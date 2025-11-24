router.get('/filtrar', controller.filtrarProductos);

import express from "express";
import Producto from "../models/Producto.js";

const router = express.Router();

// GET /api/productos → listar todos
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", error });
    }
});

export default router.get('/filtrar', controller.filtrarProductos);