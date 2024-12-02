// managers/CartManager.js
import Cart from '../models/cart.js';

class CartManager {
  // Método para crear un carrito
  async createCart() {
    const cart = new Cart();
    await cart.save();
    return cart;
  }

  // Método para obtener un carrito por ID
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product'); // Devuelve el carrito con productos
  }

  // Método para agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    if (quantity <= 0 || isNaN(quantity)) {
      return { error: "La cantidad debe ser mayor que 0" }; // Validación de cantidad
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return { error: "Cart not found" }; // Si el carrito no existe
    }

    const existingProductIndex = cart.products.findIndex(prod => prod.product.toString() === productId);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, actualizamos su cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, lo agregamos con la cantidad
      cart.products.push({ product: productId, quantity });
    }

    await cart.save(); // Guardamos el carrito actualizado
    return cart;
  }

  // Método para eliminar un producto del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return { error: "Cart not found" }; // Si el carrito no existe
    }

    // Encontramos el índice del producto
    const productIndex = cart.products.findIndex(prod => prod.product.toString() === productId);

    if (productIndex === -1) {
      return { error: "Product not found in cart" }; // Si el producto no está en el carrito
    }

    // Eliminar el producto
    cart.products.splice(productIndex, 1);

    await cart.save(); // Guardamos el carrito actualizado
    return cart;
  }

  // Método para actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    if (quantity <= 0 || isNaN(quantity)) {
      return { error: "La cantidad debe ser mayor que 0" }; // Validación de cantidad
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return { error: "Cart not found" }; // Si el carrito no existe
    }

    const productIndex = cart.products.findIndex(prod => prod.product.toString() === productId);

    if (productIndex === -1) {
      return { error: "Product not found in cart" }; // Si el producto no está en el carrito
    }

    // Actualizamos la cantidad del producto
    cart.products[productIndex].quantity = quantity;

    await cart.save(); // Guardamos el carrito actualizado
    return cart;
  }

  // Método para limpiar el carrito (eliminar todos los productos)
  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return { error: "Cart not found" }; // Si el carrito no existe
    }

    // Limpiamos los productos del carrito
    cart.products = [];

    await cart.save(); // Guardamos el carrito vacío
    return cart;
  }
}

export default new CartManager();
