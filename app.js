import express from 'express';
import http from 'http';
import { Server } from 'socket.io';  // Importar correctamente Socket.io
import expressHandlebars from 'express-handlebars';  // Importar correctamente el módulo

import productsRouter from './Routes/products.js'; // Asegúrate de que la carpeta se llama 'routes'
import cartsRouter from './Routes/carts.js';       // Asegúrate de que la carpeta se llama 'routes'

// Crear la aplicación de Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);  // Usamos la exportación 'Server' de socket.io

// Configuración de Handlebars (usando create() para obtener la instancia correcta)
const hbs = expressHandlebars.create();  // Crear la instancia del motor de plantillas
app.engine('handlebars', hbs.engine);  // Configuramos el motor de plantillas Handlebars
app.set('view engine', 'handlebars');

// Middleware para manejar los datos POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datos de productos (usaremos una estructura simple de array para esto)
let productos = [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 },
];

// Rutas estáticas (productos y carritos)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para mostrar la página de productos (Página de inicio con todos los productos)
app.get('/', (req, res) => {
    res.render('home', { productos });
});

// Ruta para mostrar la página en tiempo real de productos (realTimeProducts)
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos });
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Conexión de websockets
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    
    // Emitir los productos actuales al nuevo cliente al momento de la conexión
    socket.emit('productosIniciales', productos);

    // Agregar un producto (desde websocket)
    socket.on('agregarProducto', (producto) => {
        const nuevoProducto = { 
            id: productos.length + 1, 
            nombre: producto.nombre, 
            precio: parseFloat(producto.precio) 
        };
        productos.push(nuevoProducto);
        io.emit('nuevoProducto', nuevoProducto);  // Emitir el nuevo producto a todos los clientes conectados
    });

    // Eliminar un producto (desde websocket)
    socket.on('eliminarProducto', (id) => {
        productos = productos.filter(producto => producto.id != id);
        io.emit('productoEliminado', id);  // Emitir la eliminación a todos los clientes conectados
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});




















// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';  // Importar correctamente Socket.io
// import expressHandlebars from 'express-handlebars';  // Importar correctamente el módulo

// import productsRouter from './Routes/products.js'; // Asegúrate de que la carpeta se llama 'routes'
// import cartsRouter from './Routes/carts.js';       // Asegúrate de que la carpeta se llama 'routes'

// // Crear la aplicación de Express
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);  // Usamos la exportación 'Server' de socket.io

// // Configuración de Handlebars (usando create() para obtener la instancia correcta)
// const hbs = expressHandlebars.create();  // Crear la instancia del motor de plantillas
// app.engine('handlebars', hbs.engine);  // Configuramos el motor de plantillas Handlebars
// app.set('view engine', 'handlebars');

// // Middleware para manejar los datos POST
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Datos de productos (usaremos una estructura simple de array para esto)
// let productos = [
//     { id: 1, nombre: 'Producto 1', precio: 100 },
//     { id: 2, nombre: 'Producto 2', precio: 200 },
// ];

// // Rutas estáticas (productos y carritos)
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);

// // Ruta para mostrar la página de productos
// app.get('/', (req, res) => {
//     res.render('home', { productos });
// });

// // Ruta para mostrar la página en tiempo real de productos
// app.get('/realtimeproducts', (req, res) => {
//     res.render('realTimeProducts', { productos });
// });

// // Iniciar el servidor
// const PORT = 8080;
// server.listen(PORT, () => {
//     console.log(`Servidor escuchando en http://localhost:${PORT}`);
// });

// // Conexión de websockets
// io.on('connection', (socket) => {
//     console.log('Un cliente se ha conectado');
    
//     // Emitir los productos actuales al nuevo cliente
//     socket.emit('productosIniciales', productos);

//     // Agregar un producto (desde websocket)
//     socket.on('agregarProducto', (producto) => {
//         const nuevoProducto = { 
//             id: productos.length + 1, 
//             nombre: producto.nombre, 
//             precio: parseFloat(producto.precio) 
//         };
//         productos.push(nuevoProducto);
//         io.emit('nuevoProducto', nuevoProducto);  // Emitir el nuevo producto a todos
//     });

//     // Eliminar un producto (desde websocket)
//     socket.on('eliminarProducto', (id) => {
//         productos = productos.filter(producto => producto.id != id);
//         io.emit('productoEliminado', id);  // Emitir la eliminación a todos
//     });

//     socket.on('disconnect', () => {
//         console.log('Un cliente se ha desconectado');
//     });
// });
