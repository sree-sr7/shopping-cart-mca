// js/auth.js

// --- Configuration ---
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    handleUrlSession();
    updateNavbar();
    setTimeout(rewriteLinks, 100);
});

// Handle browser back/forward button (including cached pages)
window.addEventListener('pageshow', function (event) {
    // If page was loaded from cache (back/forward button)
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        // Force check logout status
        if (sessionStorage.getItem('hasLoggedOut') === 'true') {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('cart');
            // Force page reload to show logged out state
            window.location.reload();
        }
    }
});

// --- Core Functions ---

// 1. Handle Session & Database Sync (Fix for file:// protocol)
function handleUrlSession() {
    const params = new URLSearchParams(window.location.search);

    // SECURITY CHECK FIRST: If user has logged out, block ALL session restoration
    if (sessionStorage.getItem('hasLoggedOut') === 'true') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        // Clear user-specific carts
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach(u => {
            localStorage.removeItem(`cart_${u.email}`);
        });
        // Clean URL and stop processing
        window.history.replaceState({}, document.title, window.location.pathname);
        return; // CRITICAL: Stop here, don't process any URL params
    }

    // Handle logout SECOND (for the logout redirect itself)
    if (params.get('logout') === 'true') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        window.history.replaceState({}, document.title, window.location.pathname);
        return; // Stop here, don't process other params
    }

    // A. Sync Registered User
    const syncUserParam = params.get('syncUser');
    if (syncUserParam) {
        try {
            const newUser = JSON.parse(decodeURIComponent(syncUserParam));
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (!users.some(u => u.email === newUser.email)) {
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
            }
        } catch (e) {
            console.error("Error syncing user:", e);
        }
    }

    // B. Login Session Sync
    const userParam = params.get('user');
    if (userParam) {
        try {
            const user = JSON.parse(decodeURIComponent(userParam));
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error("Error parsing session:", e);
        }
    }

    // C. Cart Sync
    const cartParam = params.get('cart');
    if (cartParam) {
        try {
            const cart = JSON.parse(decodeURIComponent(cartParam));
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            // Save to global cart
            localStorage.setItem('cart', JSON.stringify(cart));

            // Also save to user-specific cart if user is logged in
            if (currentUser) {
                const cartKey = `cart_${currentUser.email}`;
                localStorage.setItem(cartKey, JSON.stringify(cart));
            }
        } catch (e) {
            console.error("Error parsing cart:", e);
        }
    }

    // Clean URL
    if (syncUserParam || userParam || cartParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// 2. Update Navbar based on Auth State
function updateNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('authLinks');

    if (!authLinks) return;

    if (currentUser) {
        // LOGGED IN
        authLinks.innerHTML = `
            <li class="nav-item">
                <span class="nav-link fw-bold text-primary">Hello, ${currentUser.name}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Logout</a>
            </li>
        `;

        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        }

        // Handle Login Page Redirects
        const page = window.location.pathname.split('/').pop();
        if (page === 'login.html' || page === 'register.html' || page === 'admin-login.html') {
            const dashboard = currentUser.role === 'admin' ? 'admin.html' : 'index.html';
            const container = document.querySelector('.container');
            if (container && !document.getElementById('alreadyLoggedInAlert')) {
                container.innerHTML = `
                    <div class="alert alert-success text-center mt-5" id="alreadyLoggedInAlert">
                        <h3>You are already logged in!</h3>
                        <div class="mt-3">
                            <a href="${dashboard}" class="btn btn-primary">Go to Dashboard</a>
                            <button onclick="logout()" class="btn btn-outline-danger">Logout</button>
                        </div>
                    </div>
                `;
            }
        }

    } else {
        // LOGGED OUT
        authLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html">Register</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-danger" href="admin-login.html">Admin Login</a>
            </li>
        `;

        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'none';
    }

    rewriteLinks();
}

// 3. Rewrite Links to Persist Session & Cart
function rewriteLinks() {
    const currentUser = localStorage.getItem('currentUser');
    const cart = localStorage.getItem('cart');

    let params = new URLSearchParams();

    if (currentUser) {
        params.set('user', currentUser);
    }

    if (cart) {
        params.set('cart', cart);
    }

    const queryString = params.toString();
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('.html') && !href.startsWith('http') && !href.includes('logout=true')) {
            const base = href.split('?')[0];
            link.href = queryString ? `${base}?${queryString}` : base;
        }
    });
}

// 4. Login Function
function login(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        const adminUser = { name: "Admin", email: email, role: "admin" };
        completeLogin(adminUser);
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        completeLogin(user);
    } else {
        alert("Invalid email or password!");
    }
}

// 5. Complete Login & Redirect
function completeLogin(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Clear the logout flag since user is now logged in
    sessionStorage.removeItem('hasLoggedOut');

    const cart = localStorage.getItem('cart');
    let url = `${user.role === 'admin' ? 'admin.html' : 'index.html'}?user=${encodeURIComponent(JSON.stringify(user))}`;
    if (cart) {
        url += `&cart=${encodeURIComponent(cart)}`;
    }

    window.location.href = url;
}

// 6. Register Function
function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email) || email === ADMIN_EMAIL) {
        alert("Email already registered!");
        return;
    }
    const newUser = { name, email, password, role: 'user' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const syncUserParam = encodeURIComponent(JSON.stringify(newUser));
    alert("Registration successful! Please login.");
    window.location.href = `login.html?syncUser=${syncUserParam}`;
}

// 7. Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');

    // Mark that we've logged out in sessionStorage (survives page refresh but not browser close)
    sessionStorage.setItem('hasLoggedOut', 'true');

    // Use replace instead of href to prevent back button from going to logged-in state
    window.location.replace('login.html?logout=true');
}

// Expose rewriteLinks globally so cart.js can call it after updating cart
window.rewriteLinks = rewriteLinks;
