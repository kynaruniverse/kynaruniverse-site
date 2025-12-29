/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR SHOP SYSTEM (SUPABASE EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 * @description Fetches products from Supabase and renders the matrix grid.
 */

import { supabase } from './supabase-config.js';

const ShopSystem = (() => {
  
  // 1. STATE MANAGEMENT
  let products = [];

  const DOM = {
    grid: document.querySelector(".shop-grid"),
    search: document.querySelector(".search-input"),
    filters: document.querySelectorAll(".filter-pill")
  };

  // 2. DATA FETCHING (The Connection)
  async function fetchProducts() {
    // Show Loading Skeleton
    if(DOM.grid) DOM.grid.innerHTML = '<div style="padding:2rem; text-align:center;">Loading System Data...</div>';

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      // Map SQL Data to UI Visuals (Icons/Colors)
      products = data.map(item => ({
        ...item,
        // Convert DB Numeric Price to formatted String for UI
        displayPrice: item.price === 0 ? "Free" : `£${Number(item.price).toFixed(2)}`,
        // Assign Visuals based on Category (since DB doesn't have icons/bg yet)
        icon: getCategoryIcon(item.category),
        bg: getCategoryColor(item.category),
        tag: item.category ? item.category.toUpperCase() : "SYSTEM"
      }));

      // Expose to window for Cart
      window.KynarDB = products; 
      
      Renderer.buildGrid(products);
      
    } catch (err) {
      console.error("Shop Error:", err);
      if(DOM.grid) DOM.grid.innerHTML = `<div style="color:red; text-align:center;">Connection Error: ${err.message}</div>`;
    }
  }

  // 3. VISUAL HELPERS (The "Paint")
  function getCategoryIcon(cat) {
    const map = {
      'systems': '⚡',
      'creative': '🎨',
      'business': '🚀',
      'ai': '🤖',
      'education': '📅'
    };
    return map[cat] || '📦'; // Default icon
  }

  function getCategoryColor(cat) {
    const map = {
      'systems': 'var(--grad-gold)',
      'creative': 'var(--bg-canvas)',
      'business': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      'ai': '#e0f2f1',
      'education': '#fff3e0'
    };
    return map[cat] || '#f5f5f5';
  }

  // 4. THE RENDERER
  const Renderer = {
    buildGrid(items) {
      if (!DOM.grid) return;
      
      DOM.grid.style.opacity = "0";
      
      setTimeout(() => {
        DOM.grid.innerHTML = "";
        
        if (items.length === 0) {
          DOM.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1rem; opacity:0.5;">
                <div style="font-size:2rem; margin-bottom:1rem;">🔍</div>
                <div>No systems found.</div>
            </div>`;
        } else {
          items.forEach(item => {
            DOM.grid.innerHTML += this.createNode(item);
          });
          Controller.attachCartListeners();
        }
        DOM.grid.style.opacity = "1";
      }, 200);
    },

    createNode(item) {
      const isFree = item.price === 0 || item.price === "0";
      const btnClass = isFree ? "btn-ghost" : "btn-gold";
      const btnText = isFree ? "Download" : "Add to Cart";
      
      // If it's free, we use the Secure Vault (downloadProduct). 
      // If paid, we use Cart (data-id).
      const actionAttr = isFree 
        ? `onclick="window.downloadProduct('${item.file_path}')"` 
        : `data-id="${item.id}"`;

      return `
        <div class="product-node">
            <a href="product.html?id=${item.id}" class="node-preview" style="text-decoration:none;">
                <div style="font-size: 2.5rem;">${item.icon}</div>
                <span class="node-tag">${item.tag}</span>
            </a>
            <div class="node-details">
                <a href="product.html?id=${item.id}" class="node-title" style="text-decoration:none;">${item.title}</a>
                <div class="node-price">${item.displayPrice}</div>
                <button class="node-btn ${btnClass}" ${actionAttr}>${btnText}</button>
            </div>
        </div>`;
    }
  };

  // 5. THE CONTROLLER
  const Controller = {
    init() {
      fetchProducts();
      this.bindEvents();
    },

    bindEvents() {
      // Search
      if (DOM.search) {
        DOM.search.addEventListener("input", (e) => {
          const term = e.target.value.toLowerCase();
          const filtered = products.filter(i => i.title.toLowerCase().includes(term));
          Renderer.buildGrid(filtered);
        });
      }

      // Filter Pills
      if (DOM.filters) {
        DOM.filters.forEach(pill => {
          pill.addEventListener("click", (e) => {
            e.preventDefault();
            DOM.filters.forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");

            const cat = e.target.innerText.toLowerCase();
            if (cat.includes("all")) {
                Renderer.buildGrid(products);
            } else {
                const filtered = products.filter(p => 
                    (p.category && p.category.includes(cat)) || 
                    (p.tag && p.tag.toLowerCase().includes(cat))
                );
                Renderer.buildGrid(filtered);
            }
          });
        });
      }
    },

    attachCartListeners() {
      // Only attach to "Add to Cart" buttons (not Download buttons)
      const buttons = document.querySelectorAll(".node-btn[data-id]");
      buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const id = btn.dataset.id;
          // Note: In Supabase, ID is number, but dataset is string. 
          // We use == loose equality or convert.
          const product = products.find(p => p.id == id);

          if (product && window.KynarCart) {
            window.KynarCart.add({
                id: product.id,
                title: product.title,
                price: product.price, // Pass Raw Numeric Price
                meta: product.tag,
                icon: product.icon,
                bg: product.bg
            });
          }
        });
      });
    }
  };

  return { init: Controller.init };
})();

// Start System
document.addEventListener("DOMContentLoaded", () => ShopSystem.init());
