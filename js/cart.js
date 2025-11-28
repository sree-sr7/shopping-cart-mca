// js/cart.js

// Get cart key for current user
function getCartKey() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return null;
    return `cart_${currentUser.email}`;
}

// Get cart for current user
function getCart() {
    const cartKey = getCartKey();
    if (!cartKey) return [];
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// Save cart for current user
function saveCart(cart) {
    const cartKey = getCartKey();
    if (!cartKey) return;
    localStorage.setItem(cartKey, JSON.stringify(cart));

    // Also update the global 'cart' for URL sync (backward compatibility)
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.productId == productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();

    // Update links to include new cart state
    if (window.rewriteLinks) {
        window.rewriteLinks();
    }

    alert('Item added to cart!');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId != productId);
    saveCart(cart);
    updateCartCount();

    // Update links to include new cart state
    if (window.rewriteLinks) {
        window.rewriteLinks();
    }
}

function updateCartItemQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(i => i.productId == productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
    updateCartCount();

    // Update links to include new cart state
    if (window.rewriteLinks) {
        window.rewriteLinks();
    }
}

function clearCart() {
    const cartKey = getCartKey();
    if (cartKey) {
        localStorage.removeItem(cartKey);
    }
    localStorage.removeItem('cart');
    updateCartCount();

    // Update links to include new cart state (empty)
    if (window.rewriteLinks) {
        window.rewriteLinks();
    }
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// Load user's cart when they login
function loadUserCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const cartKey = `cart_${currentUser.email}`;
        const userCart = localStorage.getItem(cartKey);
        if (userCart) {
            // Sync to global cart for URL params
            localStorage.setItem('cart', userCart);
        } else {
            // If no user cart exists, check if there's a global cart to migrate
            const globalCart = localStorage.getItem('cart');
            if (globalCart) {
                localStorage.setItem(cartKey, globalCart);
            }
        }
        updateCartCount();
    }
}

// Call loadUserCart immediately when script loads
loadUserCart();

document.addEventListener('DOMContentLoaded', () => {
    loadUserCart();
    updateCartCount();
});
