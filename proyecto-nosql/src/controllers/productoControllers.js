exports.filtrarProductos = async (req, res) => {
    const { categoria, minPrecio, maxPrecio, page = 1, limit = 5 } = req.query;

    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (minPrecio) filtro.precio = { $gte: Number(minPrecio) };
    if (maxPrecio)
        filtro.precio = { ...filtro.precio, $lte: Number(maxPrecio) };

    const productos = await Producto.find(filtro)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json(productos);
};
