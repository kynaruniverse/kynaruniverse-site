# Kynar Studio | Digital Marketplace 🏛️

A versatile marketplace for curated digital assets, designed for all occasions and creators. Built with a focus on mobile-first aesthetics, tactile physics, and modular architecture.

---

## 🏗️ Technical Architecture

- **Skin:** `styles.css` (Bone/Emerald "Day" system & Obsidian "Night" system)
- **Physics:** `ui-core.js` (Lenis Smooth Scroll, V4.0 Component Injection, Haptic Engine)
- **Components:** `components/header.html` (Global shared navigation)
- **Database:** `vault.js` (Centralized JSON product architecture)
- **Commerce:** Lemon Squeezy Overlay Integration
- **Backend:** Formspree (Lead Magnet & Concierge routing)

---

## 📁 File Structure

```text
/root
├── index.html            # Brand Storefront
├── shop.html             # Filterable Archive Gallery
├── product.html          # Dynamic Template Engine
├── freebie.html          # Lead Magnet (The Starter Kit)
├── contact.html          # Support Concierge
├── newsletter.html       # The Network Hub
├── success.html          # Transaction Handover Page
├── claim-archived.html   # Secure Download Gateway
├── 404.html              # Coordinate Redirection
├── robots.txt            # Crawler Directives
├── sitemap.xml           # SEO Map
│
├── assets/               # Fonts, Grain textures, and Product mockups
│
├── components/           # Modular HTML fragments
│   ├── header.html
│   └── footer.html
│
└── js/                   # (Optional: organize scripts here)
    ├── ui-core.js
    ├── vault.js
    └── prelaunch-logic.js
