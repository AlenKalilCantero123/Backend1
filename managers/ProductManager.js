import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path; // Define la ruta donde se guardará el archivo de productos
    }

    // Obtiene todos los productos del archivo
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data); // Parsear el contenido JSON
        } catch (error) {
            return []; // Retorna un array vacío si hay un error al leer el archivo
        }
    }

    // Obtiene un producto por ID
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === parseInt(id)) || null; // Retorna el producto o null
    }

    // Agrega un nuevo producto
    async addProduct(product) {
        const products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1; // Asignar un ID único
        products.push(product); // Agregar el nuevo producto al array
        await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // Guardar el array actualizado en el archivo
    }

    // Actualiza un producto existente
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === parseInt(id)); // Buscar el índice del producto
        if (index === -1) return null; // Retornar null si no se encuentra el producto

        // Actualizar campos sin modificar el ID
        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // Guardar cambios en el archivo
        return products[index]; // Retornar el producto actualizado
    }

    // Elimina un producto por ID
    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length; // Guardar la longitud inicial del array
        products = products.filter(product => product.id !== parseInt(id)); // Filtrar el producto que se desea eliminar
        if (products.length === initialLength) return false; // Retornar false si no se encontró el producto

        await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // Guardar los productos restantes en el archivo
        return true; // Retornar true si el producto fue eliminado
    }
}

export default new ProductManager('./products.json'); // Crear una instancia del ProductManager con la ruta del archivo
