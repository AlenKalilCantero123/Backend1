import mongoose from 'mongoose';

// Definir el esquema y modelo de producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'available' },
});

const Product = mongoose.model('Product', productSchema);

// Lógica para el factory que crea el ProductManager
const productManagerFactory = (db) => {
  return {
    // Obtener todos los productos
    getProducts: async () => {
      try {
        return await Product.find(); // Devuelve todos los productos
      } catch (error) {
        throw new Error(`Error al obtener productos: ${error.message}`);
      }
    },

    // Agregar un producto
    addProduct: async (product) => {
      try {
        if (!product.name || !product.price || !product.category) {
          throw new Error('Todos los campos (name, price, category) son obligatorios.');
        }

        // Asegurarse de que el precio sea un número
        const newProduct = new Product({
          name: product.name,
          price: parseFloat(product.price),
          category: product.category,
          status: product.status || 'available',
        });

        return await newProduct.save();
      } catch (error) {
        throw new Error(`Error al agregar producto: ${error.message}`);
      }
    },

    // Eliminar un producto por ID
    deleteProduct: async (id) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('El ID proporcionado no es válido.');
        }

        const result = await Product.findByIdAndDelete(id);
        if (!result) {
          throw new Error('No se encontró un producto con el ID especificado.');
        }
        return true;
      } catch (error) {
        throw new Error(`Error al eliminar producto: ${error.message}`);
      }
    },
  };
};

export default productManagerFactory;
