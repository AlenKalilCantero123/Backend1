import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await CartManager.createCart();
    res.status(201).json(newCart); // Retornar 201 para indicar que se ha creado
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const cart = await CartManager.getCartById(req.params.cid);
    res.json(cart || { error: "Cart not found" });
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body; // Se espera que la cantidad se envíe en el cuerpo de la solicitud
    const updatedCart = await CartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
    
    if (updatedCart) {
        res.json(updatedCart); // Retornar el carrito actualizado
    } else {
        res.status(404).json({ error: "Cart not found" }); // Retornar 404 si el carrito no existe
    }
});

export default router;
