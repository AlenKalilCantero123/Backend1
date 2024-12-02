import Product from '../models/product.js';

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validación de datos
  if (!name || !price || !category || !stock) {
    return res.status(400).json({ status: 'error', message: 'Todos los campos son requeridos.' });
  }

  try {
    const newProduct = new Product({ name, price, category, stock });
    await newProduct.save();
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Obtener productos con filtros, paginación y ordenamiento
export const getProducts = async (req, res) => {
  try {
    // Extracción y validación de parámetros
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;
    
    // Validar el parámetro 'limit' para evitar valores inválidos
    const validLimit = Math.max(1, Math.min(100, parseInt(limit))); // Limitar a un máximo de 100 productos por página
    const validPage = Math.max(1, parseInt(page));

    // Filtro por categoría si "query" es pasado
    const queryFilters = query ? { category: query } : {};

    // Ordenar por precio o nombre, dependiendo del parámetro 'sort'
    const sortOptions = sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : {};

    // Buscar productos con filtros, orden y paginación
    const products = await Product.find(queryFilters)
      .sort(sortOptions)
      .skip((validPage - 1) * validLimit) // Paginación
      .limit(validLimit); // Limitar número de productos

    const totalProducts = await Product.countDocuments(queryFilters); // Contar productos totales

    const totalPages = Math.ceil(totalProducts / validLimit); // Calcular total de páginas
    const hasPrevPage = validPage > 1;
    const hasNextPage = validPage < totalPages;

    res.status(200).json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? validPage - 1 : null,
      nextPage: hasNextPage ? validPage + 1 : null,
      page: validPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/products?page=${validPage - 1}&limit=${validLimit}` : null,
      nextLink: hasNextPage ? `/products?page=${validPage + 1}&limit=${validLimit}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
