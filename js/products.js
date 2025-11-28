// js/products.js

// Default Data
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 24999,
        description: "High-fidelity audio with noise cancellation.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 15999,
        description: "Track your health and fitness goals.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    },
    {
        id: 3,
        name: "Ergonomic Office Chair",
        price: 35000,
        description: "Comfortable chair for long work hours.",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80"
    },
    {
        id: 4,
        name: "4K Ultra HD Monitor",
        price: 28500,
        description: "Stunning visuals for work and play.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
    }
];

// Get Products (Safe Mode)
function getProducts() {
    try {
        const stored = localStorage.getItem('products');
        if (stored) {
            const products = JSON.parse(stored);
            // Validation: Ensure it's an array and has valid prices
            if (Array.isArray(products) && products.length > 0 && products[0].price > 1000) {
                return products;
            }
        }
    } catch (e) {
        console.error("Error reading products:", e);
    }

    // Fallback: Reset and return default
    localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
}

// Add Product
function addProduct(product) {
    const products = getProducts();
    product.id = Date.now();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

// Update Product
function updateProduct(id, newData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...newData };
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Delete Product
function deleteProduct(id) {
    const products = getProducts();
    const filtered = products.filter(p => p.id != id);
    localStorage.setItem('products', JSON.stringify(filtered));
}

// Get Single Product
function getProductById(id) {
    return getProducts().find(p => p.id == id);
}
