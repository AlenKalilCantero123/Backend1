// models/product.js
import mongoose from 'mongoose';

// Crear el esquema para los productos
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
});

// Crear el modelo
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
export default Product;
