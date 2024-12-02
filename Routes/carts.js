import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartManager.createCart();
        res.status(201).json(newCart); // Retornar 201 para indicar que se ha creado
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" }); // Manejo de errores
    }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" }); // Retornar 404 si no se encuentra el carrito
        }
        res.json(cart); // Retornar el carrito encontrado
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" }); // Manejo de errores
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body; // Se espera que la cantidad se envíe en el cuerpo de la solicitud

    // Validación de cantidad
    if (quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor que 0" });
    }

    try {
        const updatedCart = await CartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        
        if (updatedCart.error) {
            return res.status(404).json(updatedCart); // Si el carrito no existe o hay algún error, retornar 404
        }
        res.json(updatedCart); // Retornar el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito" }); // Manejo de errores
    }
});

// Ruta para eliminar un producto del carrito
router.post('/:cid/remove/:pid', async (req, res) => {
    try {
        const updatedCart = await CartManager.removeProductFromCart(req.params.cid, req.params.pid);
        
        if (updatedCart.error) {
            return res.status(404).json(updatedCart); // Si el carrito no existe o el producto no está en el carrito
        }
        res.json(updatedCart); // Retornar el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto del carrito" }); // Manejo de errores
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.post('/:cid/update/:pid', async (req, res) => {
    const { quantity } = req.body; // Se espera que la cantidad se envíe en el cuerpo de la solicitud

    // Validación de cantidad
    if (quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor que 0" });
    }

    try {
        const updatedCart = await CartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);

        if (updatedCart.error) {
            return res.status(404).json(updatedCart); // Si el carrito no existe o el producto no está en el carrito
        }
        res.json(updatedCart); // Retornar el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad del producto" }); // Manejo de errores
    }
});

// Ruta para eliminar todos los productos del carrito
router.post('/:cid/clear', async (req, res) => {
    try {
        const clearedCart = await CartManager.clearCart(req.params.cid);
        
        if (clearedCart.error) {
            return res.status(404).json(clearedCart); // Si el carrito no existe
        }
        res.json(clearedCart); // Retornar el carrito vacío
    } catch (error) {
        res.status(500).json({ error: "Error al limpiar el carrito" }); // Manejo de errores
    }
});

export default router;
