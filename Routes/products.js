import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

// Ruta para obtener productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
        const productsPerPage = parseInt(limit);
        const currentPage = parseInt(page);
        const skip = (currentPage - 1) * productsPerPage;

        // Crear filtro para búsqueda de productos por categoría o disponibilidad
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: { $regex: query, $options: 'i' } },
                    { status: { $regex: query, $options: 'i' } }
                ]
            };
        }

        // Ordenamiento
        const sortOrder = sort === 'desc' ? -1 : 1;

        // Obtener productos con el filtro y orden
        const products = await ProductManager.getProducts(filter, skip, productsPerPage, sortOrder);

        // Obtener el total de productos que coinciden con el filtro
        const totalProducts = await ProductManager.countProducts(filter);

        // Calcular número de páginas
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;
        const prevPage = hasPrevPage ? currentPage - 1 : null;
        const nextPage = hasNextPage ? currentPage + 1 : null;

        // Links de navegación
        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&limit=${productsPerPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}&limit=${productsPerPage}&sort=${sort}&query=${query}` : null;

        return res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });

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

export default router;
