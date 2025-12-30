# Kynar Studio | Digital Marketplace 🏛️

A versatile marketplace for curated digital assets, designed for all occasions and creators. Built with a focus on mobile-first aesthetics, tactile physics, and modular architecture.


## 🏗️ Technical Architecture
- **Skin:** `styles.css` (Bone/Emerald "Day" system & Obsidian "Night" system)
- **Physics:** `ui-core.js` (Lenis Smooth Scroll, V4.0 Component Injection, Haptic Engine)
- **Components:** `components/header.html` (Global shared navigation)
- **Database:** `vault.js` (Centralized JSON product architecture)
- **Commerce:** Lemon Squeezy Overlay Integration
- **Backend:** Formspree (Lead Magnet & Concierge routing)

## 📁 File Structure
- `index.html` — Brand Storefront
- `shop.html` — Filterable Archive Gallery
- `product.html` — Dynamic Template Engine
- `freebie.html` — Lead Magnet (The Starter Kit)
- `claim-archived.html` — Secure Download Gateway
- `contact.html` — Support Concierge
- `newsletter.html` — The Network Hub
- `success.html` — Transaction Handover Page
- `404.html` — Coordinate Redirection
- `/components/` — Modular HTML fragments
- `/assets/` — Fonts, Grain textures, and Product mockups

## 🌑 Obsidian Mode
The system features a persistent Dark Mode engine. User preference is stored in `localStorage` and synchronized across all pages via the modular header toggle.

## 🚀 Deployment & Local Testing
1. **Local Testing:** Because the site uses `fetch()` to load the header, you must use a local server (e.g., Live Server extension in VS Code) to view the header.
2. **Product Updates:** All inventory changes should be made in `vault.js`.
3. **Checkout:** Replace `#` in `vault.js` with production Lemon Squeezy URLs.
4. **Hosting:** Optimized for GitHub Pages, Vercel, or Netlify.

---
© 2025 Kynaruniverse. Orchestrated in Clacton-on-Sea • London.
