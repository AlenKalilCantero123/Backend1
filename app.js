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
const url = 'mongodb+srv://alenkalilcantero:123alen@cluster0Backend.wonj1.mongodb.net/Backend?retryWrites=true&w=majority';
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
        console.error('Error al obtener productos:', err.message);
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
        .catch(err => console.error('Error al obtener productos iniciales:', err.message));

      // Agregar un producto
      socket.on('agregarProducto', async (producto) => {
        console.log('Producto recibido para agregar:', producto);

        // Validar que todos los campos estén presentes
        if (!producto.name || !producto.price || !producto.category) {
          console.error('Faltan datos obligatorios al agregar producto.');
          socket.emit('errorAgregarProducto', { mensaje: 'Todos los campos son obligatorios: nombre, precio y categoría.' });
          return;
        }

        // Validar que el precio sea un número válido
        const price = parseFloat(producto.price);
        if (isNaN(price) || price <= 0) {
          console.error('El precio debe ser un número positivo.');
          socket.emit('errorAgregarProducto', { mensaje: 'El precio debe ser un número válido y positivo.' });
          return;
        }

        try {
          // Crear el producto con datos válidos
          const newProduct = await productManager.addProduct({
            name: producto.name,
            price,
            category: producto.category,
            status: producto.disponible ? 'available' : 'unavailable',
          });
          io.emit('nuevoProducto', newProduct); // Emitir el nuevo producto a todos los clientes
        } catch (err) {
          console.error('Error al agregar producto:', err.message);
          socket.emit('errorAgregarProducto', { mensaje: 'No se pudo agregar el producto. Intente nuevamente.' });
        }
      });

      // Eliminar un producto
      socket.on('eliminarProducto', async (id) => {
        console.log('ID recibido para eliminar:', id);

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          console.error('ID no válido.');
          socket.emit('errorEliminarProducto', { mensaje: 'ID no válido.' });
          return;
        }

        try {
          const success = await productManager.deleteProduct(id);
          if (success) {
            io.emit('productoEliminado', id); // Emitir la eliminación a todos los clientes
          } else {
            console.error('Producto no encontrado para eliminar:', id);
          }
        } catch (err) {
          console.error('Error al eliminar producto:', err.message);
          socket.emit('errorEliminarProducto', { mensaje: 'No se pudo eliminar el producto. Intente nuevamente.' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
      });
    });
  })
  .catch(err => console.error('Error de conexión a MongoDB:', err.message));
