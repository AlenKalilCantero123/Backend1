// models/cart.js
import mongoose from 'mongoose';

// Crear el esquema para los carritos
const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Relación con el modelo 'Product'
    quantity: { type: Number, required: true, min: 1 } // Aseguramos que quantity siempre sea un número mayor que 0
  }],
});

// Crear el modelo
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
