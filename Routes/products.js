import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

// Función de validación para los campos del producto
const validateProduct = (product) => {
    const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    for (const field of requiredFields) {
        if (!product[field]) {
            return { valid: false, message: `Missing field: ${field}` };
        }
    }
    return { valid: true };
};

// Ruta para obtener todos los productos (API, no se usará con websockets)
router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// Ruta para obtener un producto por ID (API, no se usará con websockets)
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await ProductManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving product' });
    }
});

export default router;
