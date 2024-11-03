// 


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

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// Ruta para obtener un producto por ID
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

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const validation = validateProduct(product);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }
        await ProductManager.addProduct(product);
        res.status(201).json({ status: 'success', msg: 'Product added' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product' });
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = req.body;
        const validation = validateProduct(updatedProduct);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }
        const result = await ProductManager.updateProduct(req.params.pid, updatedProduct);
        if (result) {
            res.json({ status: 'success', msg: 'Product updated' });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const result = await ProductManager.deleteProduct(req.params.pid);
        if (result) {
            res.json({ status: 'success', msg: 'Product deleted' });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

export default router;
















// import { Router } from 'express';
// import ProductManager from '../managers/ProductManager.js';

// const router = Router();

// // Ruta para obtener todos los productos
// router.get('/', async (req, res) => {
//     try {
//         const products = await ProductManager.getProducts();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Error retrieving products' });
//     }
// });

// // Ruta para obtener un producto por ID
// router.get('/:pid', async (req, res) => {
//     try {
//         const productId = parseInt(req.params.pid); // Convertir a número
//         const product = await ProductManager.getProductById(productId); // Pasar el ID convertido
//         if (product) {
//             res.json(product);
//         } else {
//             res.status(404).json({ error: "Product not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error retrieving product' });
//     }
// });

// // Ruta para agregar un nuevo producto
// router.post('/', async (req, res) => {
//     try {
//         const product = req.body;
//         await ProductManager.addProduct(product);
//         res.status(201).json({ status: 'success', msg: 'Product added' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding product' });
//     }
// });

// // Ruta para actualizar un producto
// router.put('/:pid', async (req, res) => {
//     try {
//         const updatedProduct = req.body;
//         const result = await ProductManager.updateProduct(req.params.pid, updatedProduct);
//         if (result) {
//             res.json({ status: 'success', msg: 'Product updated' });
//         } else {
//             res.status(404).json({ error: "Product not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating product' });
//     }
// });

// // Ruta para eliminar un producto
// router.delete('/:pid', async (req, res) => {
//     try {
//         const result = await ProductManager.deleteProduct(req.params.pid);
//         if (result) {
//             res.json({ status: 'success', msg: 'Product deleted' });
//         } else {
//             res.status(404).json({ error: "Product not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting product' });
//     }
// });

// export default router;


