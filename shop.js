/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR SHOP SYSTEM (V1.2 - MASTER SYNC)
 * ══════════════════════════════════════════════════════════════════════════
 */

const ShopSystem = (() => {
  // 1. THE PRODUCT CATALOG
  const PRODUCTS = [
    { id: "prod_001", title: "Ultimate Notion OS", collection: "productivity", price: 24.00, image: "images/1/notion-os.webp", icon: "⚡", tag: "Notion System", downloadLink: "#" },
    { id: "prod_002", title: "Kids Activity Pack", collection: "family", price: 0.0, image: "images/1/kids-pack.webp", icon: "🎨", tag: "Printable PDF", downloadLink: "assets/kids-activity-pack.pdf" },
    { id: "prod_003", title: "Startup Launch Kit", collection: "productivity", price: 15.00, image: "images/1/startup-kit.webp", icon: "🚀", tag: "Business Guide", downloadLink: "#" },
    { id: "prod_004", title: "AI Master Prompts", collection: "creative", price: 0.0, image: "images/1/ai-prompts.webp", icon: "🤖", tag: "AI Tool", downloadLink: "assets/ai-prompts.pdf" },
    { id: "prod_005", title: "Home School Planner", collection: "family", price: 12.00, image: "images/1/homeschool.webp", icon: "🏠", tag: "Digital Planner", downloadLink: "#" }
  ];

  const DOM = {
    grid: document.getElementById("product-grid"),
    search: document.getElementById("shop-search"),
  };

  // 2. THE RENDERER
  const Renderer = {
    buildGrid(items) {
      if (!DOM.grid) return;
      DOM.grid.style.opacity = "0";

      setTimeout(() => {
        DOM.grid.innerHTML = "";
        if (items.length === 0) {
          DOM.grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 5rem; opacity:0.5;">No Products Found</div>`;
        } else {
          items.forEach((item, index) => {
            const card = document.createElement('div');
            card.innerHTML = this.createCard(item);
            const el = card.firstElementChild;
            el.classList.add('product-card-reveal');
            el.style.animationDelay = `${index * 0.05}s`;
            DOM.grid.appendChild(el);
          });
        }
        DOM.grid.style.opacity = "1";
      }, 200);
    },

    createCard(item) {
      const isFree = item.price === 0;
      const formattedPrice = isFree ? "Free" : `£${item.price.toFixed(2)}`;
      
      const actionBtn = isFree
          ? `<button onclick="KynarCart.add('${item.id}')" class="dock-btn" style="height: 34px; padding: 0 1.25rem; font-size: 0.75rem; background: var(--bg-canvas); color: var(--ink-display); border: 1px solid var(--ink-border);">Get Free</button>`
          : `<button onclick="KynarCart.add('${item.id}')" class="dock-btn" style="height: 34px; padding: 0 1.25rem; font-size: 0.75rem; background: var(--grad-gold); color: white; border: none;">+ Add to Cart</button>`;

      return `
        <div class="stream-card ${!isFree ? 'glimmer-card' : ''}" style="height: auto; min-height: 290px; padding: 0;">
            <div class="stream-visual" style="width: 100%; height: 160px; position: relative; overflow: hidden; background: var(--bg-canvas);">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size:3rem;">${item.icon}</div>`}
                <div style="position: absolute; top: 12px; left: 12px;">
                    <span style="background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color:var(--ink-display);">${item.collection}</span>
                </div>
            </div>
            <div style="padding: 1.25rem;">
                <div style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 800; margin-bottom: 4px; text-transform:uppercase;">${item.tag}</div>
                <div style="font-size: 1.1rem; margin-bottom: 1.2rem; font-weight:700; color:var(--ink-display);">${item.title}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--ink-border);">
                    <div>
                        <span style="display:block; font-size: 0.6rem; color: var(--ink-muted); font-weight: 700; text-transform:uppercase;">Price</span>
                        <span style="font-weight: 800; color: var(--ink-display);">${formattedPrice}</span>
                    </div>
                    ${actionBtn}
                </div>
            </div>
        </div>`;
    }
  };

  const Controller = {
    init() {
      if (DOM.grid) Renderer.buildGrid(PRODUCTS);
      this.bindEvents();
    },
    bindEvents() {
      if (DOM.search) {
        DOM.search.addEventListener("input", (e) => {
          const term = e.target.value.toLowerCase();
          const filtered = PRODUCTS.filter(i => i.title.toLowerCase().includes(term));
          Renderer.buildGrid(filtered);
        });
      }
    }
  };

  // BROADCAST DATABASE IMMEDIATELY
  window.ShopDatabase = PRODUCTS;

  return { 
    init: Controller.init, 
    getDb: () => PRODUCTS 
  };
})();

window.ShopSystem = ShopSystem;
document.addEventListener("DOMContentLoaded", () => ShopSystem.init());
