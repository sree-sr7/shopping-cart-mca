# Dynamic Online Shopping Website

## Project Overview
This is a responsive web application for an online shopping site featuring a complete user authentication system (Login/Register), an Admin Dashboard for product management, and a dynamic shopping cart. The project utilizes **Bootstrap 5** for layout and **Material Design** principles for UI aesthetics.

**Live Link:** [Insert your GitHub Pages Link Here]

## 🔑 Admin Credentials (For Testing)
To view the **Admin Dashboard** (Add/Delete Products), please use these credentials:
* **Email:** `admin@gmail.com`
* **Password:** `admin123`

---

## 🛠 Tech Stack
* **Frontend Framework:** Bootstrap 5 (Grid, Navbar, Layouts)
* **UI Design:** Material Design (Cards, Shadows, Floating Inputs)
* **Logic:** Vanilla JavaScript (ES6+)
* **Database:** Browser LocalStorage (No backend required)

## 📄 Page Documentation

### 1. Registration Page (`register.html`)
* **Purpose:** Allows new users to create an account.
* **Features:**
    * Material Design form inputs.
    * **Validation:** Checks for valid email format, password length (≥ 6), and password matching.
    * **Logic:** Prevents duplicate emails by checking the `users` array in LocalStorage.

### 2. Login Page (`login.html`)
* **Purpose:** Authenticates users before accessing the shop.
* **Logic:**
    * Compares input credentials against stored users in LocalStorage.
    * **Admin Access:** Checks for hardcoded admin credentials and redirects to the Admin view.
    * **Session Management:** Stores the logged-in user state in `localStorage` to persist sessions.

### 3. Shop Page (`shop.html`) - READ Operation
* **Purpose:** The main landing page displaying all products.
* **Features:**
    * Dynamic rendering of product cards using JavaScript `.map()`.
    * **Admin Features:** If logged in as Admin, "Delete" buttons appear on cards, and an "Add Product" link appears in the navbar.
    * **Material Cards:** Uses box-shadows and hover effects for a premium feel.

### 4. Add Product Page (`admin.html`) - CREATE Operation
* **Purpose:** Admin-only interface to add new inventory.
* **Logic:** Pushes a new product object `{id, name, price, desc, image}` into the `products` LocalStorage array.

## 💾 CRUD Operations Implemented
* **Create:** Register new users; Admins can add new products.
* **Read:** Display products dynamically from LocalStorage on the Shop page.
* **Update:** (Simulated via Admin control).
* **Delete:** Admins can remove products from the inventory, updating the UI instantly.

## 🎨 UI Components Used
* **Bootstrap:** `navbar`, `container`, `row`, `col-md-4`, `d-flex`.
* **Material Design:**
    * `box-shadow` CSS overrides for card elevation.
    * Floating labels in forms (`form-floating`).
    * Ripple-effect buttons.