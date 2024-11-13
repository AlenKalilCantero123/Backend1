import fs from 'fs/promises';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === parseInt(id)) || null;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === parseInt(cartId));
        if (!cart) return { error: "Cart not found" };

        const existingProduct = cart.products.find(prod => prod.product === parseInt(productId));
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: parseInt(productId), quantity });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default new CartManager('./carts.json');






//comentario


// import fs from 'fs/promises';

// class CartManager {
//     constructor(path) {
//         this.path = path;
//     }

//     async getCarts() {
//         try {
//             const data = await fs.readFile(this.path, 'utf-8');
//             return JSON.parse(data);
//         } catch (error) {
//             return [];
//         }
//     }


//     async getCartById(id) {
//         const carts = await this.getCarts();
//         return carts.find(cart => cart.id === parseInt(id)) || null;
//     }
    
//     async createCart() {
//         const carts = await this.getCarts();
//         const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
//         carts.push(newCart);
//         await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
//         return newCart;
//     }
//     async addProductToCart(cartId, productId, quantity = 1) {
//         const carts = await this.getCarts();
//         const cart = carts.find(cart => cart.id === parseInt(cartId));
//         if (!cart) return null;
    
//         const existingProduct = cart.products.find(prod => prod.product === parseInt(productId));
//         if (existingProduct) {
//             existingProduct.quantity += quantity;
//         } else {
//             cart.products.push({ product: parseInt(productId), quantity });
//         }
    
//         await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
//         return cart;
//     }
    
//     // Implementa las demás funciones aquí, como getCartById, addProductToCart.
// }

// export default new CartManager('./carts.json');
