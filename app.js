import express from 'express';
import productsRouter from './Routes/products.js'; // Asegúrate de que la carpeta se llama 'routes'
import cartsRouter from './Routes/carts.js';       // Asegúrate de que la carpeta se llama 'routes'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
