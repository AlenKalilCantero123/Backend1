import mongoose from 'mongoose';

// Definir el modelo de producto (suponiendo que tienes un esquema en MongoDB)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  status: String,
});

const Product = mongoose.model('Product', productSchema);

// Lógica para el factory que crea el ProductManager
const productManagerFactory = (db) => {
  const productCollection = db.collection('products');

  return {
    getProducts: async () => {
      // Obtener todos los productos de la base de datos
      try {
        const products = await productCollection.find().toArray();
        return products;
      } catch (error) {
        throw new Error('Error al obtener productos: ' + error);
      }
    },

    addProduct: async (product) => {
      // Agregar un producto a la base de datos
      try {
        const result = await productCollection.insertOne(product);
        return result.ops[0];  // Devuelve el producto insertado
      } catch (error) {
        throw new Error('Error al agregar producto: ' + error);
      }
    },

    deleteProduct: async (id) => {
      // Eliminar un producto de la base de datos por ID
      try {
        const result = await productCollection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        return result.deletedCount > 0; // Retorna true si se eliminó el producto
      } catch (error) {
        throw new Error('Error al eliminar producto: ' + error);
      }
    },
  };
};

export default productManagerFactory;  // Exportación predeterminada
