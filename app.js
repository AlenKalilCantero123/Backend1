import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import expressHandlebars from 'express-handlebars';

import productsRouter from '../Backend1/Routes/products.js';
import cartsRouter from '../Backend1/Routes/carts.js';
import cartManager from '../Backend1/managers/CartManager.js'; // Instancia única
import productManagerFactory from '../Backend1/managers/ProductManager.js'; // Importación del factory

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
const hbs = expressHandlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión con MongoDB
const url = 'mongodb+srv://alenkalilcantero:GfiSgiBAJquEu3TV@cluster0Backend.wonj1.mongodb.net/Backend?retryWrites=true&w=majority';
mongoose.connect(url)
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas');

    // Crear la instancia de productManager después de la conexión a MongoDB
    const db = mongoose.connection.db; // Obtener la conexión activa a la base de datos
    const productManager = productManagerFactory(db); // Usar el factory para crear la instancia

    // Usar rutas
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    // Ruta para la vista de productos (manejo de Handlebars)
    app.get('/', async (req, res) => {
      try {
        const products = await productManager.getProducts();
        res.render('home', { products }); // Pasar productos a la vista
      } catch (err) {
        console.log('Error al obtener productos:', err);
        res.status(500).send('Error al obtener los productos');
      }
    });

    // Ruta para los productos en tiempo real
    app.get('/realtimeproducts', (req, res) => {
      res.render('realTimeProducts');
    });

    // Iniciar el servidor
    const PORT = 8080;
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

    // Conexión de WebSockets
    io.on('connection', (socket) => {
      console.log('Un cliente se ha conectado');

      // Enviar productos iniciales desde MongoDB
      productManager.getProducts()
        .then(products => {
          socket.emit('productosIniciales', products);
        })
        .catch(err => console.log('Error al obtener productos:', err));

      // Agregar un producto
      socket.on('agregarProducto', async (producto) => {
        try {
          const newProduct = await productManager.addProduct({
            name: producto.nombre,
            price: producto.precio,
            category: producto.categoria,
            status: producto.disponible ? 'available' : 'unavailable',
          });
          io.emit('nuevoProducto', newProduct); // Emitir el nuevo producto a todos los clientes
        } catch (err) {
          console.log('Error al agregar producto:', err);
        }
      });

      // Eliminar un producto
      socket.on('eliminarProducto', async (id) => {
        try {
          const success = await productManager.deleteProduct(id);
          if (success) {
            io.emit('productoEliminado', id); // Emitir la eliminación a todos los clientes
          } else {
            console.log('Producto no encontrado para eliminar:', id);
          }
        } catch (err) {
          console.log('Error al eliminar producto:', err);
        }
      });

      socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
      });
    });
  })
  .catch(err => console.log('Error de conexión:', err));
