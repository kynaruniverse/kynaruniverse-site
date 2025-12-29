# Kynar Universe | Digital Systems Marketplace

![Project Status](https://img.shields.io/badge/Status-Operational-success)
![Version](https://img.shields.io/badge/Version-2.1.0-blue)
![License](https://img.shields.io/badge/License-Proprietary-orange)

**Kynar Universe** is a high-performance digital marketplace designed for creators and entrepreneurs. It features a custom "Glass & Grid" design system, a modular vanilla JavaScript architecture ("VisualForge"), and a fully integrated **Supabase Backend** for authentication, database management, and secure asset delivery.

---

## ⚡ Key Features

### 🎨 **VisualForge Design System**
* **Glassmorphism UI:** Frosted glass headers, modals, and sticky inputs.
* **Kinetic Physics:** Cards lift and glow on hover; inputs expand on focus.
* **Slipstream Drawers:** 60FPS CSS-driven navigation and cart sidebars.
* **Tactile Haptics:** Custom `haptics.js` engine provides vibration feedback on mobile interactions.

### 🛠 **Core Architecture**
* **Zero-Dependency:** Built on pure HTML5, CSS3, and ES6+ JavaScript. No bundlers required.
* **Centralized Logic:** `core.js` manages UI state, modal injections, and drawer physics.
* **Commerce Engine:** `cart.js` handles V3 local persistence, safe math calculations, and badge updates.
* **Identity Layer:** `auth.js` manages Supabase Authentication (Login/Register/Logout).
* **Secure Vault:** `vault.js` generates signed, temporary URLs for secure file downloads.

---

## 📂 System Topography

```text
Kynaruniverse-site/
├── assets/                 # Static resources (Fonts, Icons, Social Images)
├── components/             # Reusable HTML fragments (Header/Footer/Modals)
├── images/                 # Product visuals
│
├── styles.css              # Unified Design System (VisualForge)
│
├── core.js                 # UI Master Controller (Drawers/Modals)
├── auth.js                 # Supabase Identity Service
├── shop.js                 # Database Fetching & Rendering
├── cart.js                 # Shopping Cart Engine (V3)
├── checkout.js             # Transaction Processing
├── vault.js                # Secure Download Manager
├── haptics.js              # Tactile Feedback Engine
├── supabase-config.js      # API Configuration (Supabase)
│
├── index.html              # Homepage (Feed & Hero)
├── shop.html               # Marketplace (Matrix Grid)
├── product.html            # Dynamic Product Template
├── account.html            # Member Vault (Purchase History)
├── checkout.html           # Secure Payment Terminal
├── success.html            # Post-Purchase Landing
├── library.html            # Documentation Hub
├── newsletter.html         # Lead Generation Terminal
├── contact.html            # Support Concierge
└── 404.html                # Error Handling
