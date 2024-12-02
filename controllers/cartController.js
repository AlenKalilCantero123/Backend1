import Cart from '../models/cart.js';
import Product from '../models/product.js';
import CartManager from '../managers/CartManager.js';  // Puedes importar desde el CartManager

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params; // Carrito y producto a agregar
  const { quantity = 1 } = req.body; // Cantidad por defecto 1
  try {
    // Verificar si el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Verificar si el producto ya está en el carrito y actualizar la cantidad si es necesario
    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    
    if (productIndex !== -1) {
      // Si el producto ya está en el carrito, actualizamos su cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, lo agregamos con la cantidad
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    // Verificar si el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    // Filtrar el producto y eliminarlo
    const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    // Eliminar el producto
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantityInCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  
  if (quantity <= 0 || isNaN(quantity)) {
    return res.status(400).json({ status: 'error', message: 'La cantidad debe ser mayor que 0' });
  }

  try {
    // Verificar si el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe en el carrito
    const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    // Actualizar la cantidad del producto
    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
