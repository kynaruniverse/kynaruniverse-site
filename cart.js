/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR COMMERCE ENGINE (V1.4 - MASTER SYNC)
 * ══════════════════════════════════════════════════════════════════════════
 */

const KynarCart = {
  getKey: () => "kynar_cart_v1",

  // Ensures we ALWAYS get an array to prevent .some() or .push() errors
  getContents() {
    try {
      const data = localStorage.getItem(this.getKey());
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  add(productId) {
    try {
      // 1. Find product using global broadcast from shop.js
      const database = window.ShopDatabase || (window.ShopSystem ? window.ShopSystem.getDb() : []);
      const product = database.find(p => p.id === productId);

      if (!product) {
        console.warn("Kynar Cart: Product not found.");
        return;
      }

      // 2. Load and Update
      let contents = this.getContents();
      const exists = contents.some(item => item.id === productId);
      
      if (!exists) {
        contents.push(product);
        localStorage.setItem(this.getKey(), JSON.stringify(contents));
        
        // Visual Feedback
        this.bumpCart();
        if (window.Haptics) window.Haptics.success();
      }

      // 3. UI Synchronization
      this.syncUI();
      this.openDrawer();
      
    } catch (err) {
      console.error("Kynar Cart: Add logic failure", err);
    }
  },

  remove(productId) {
    let contents = this.getContents();
    contents = contents.filter(item => item.id !== productId);
    localStorage.setItem(this.getKey(), JSON.stringify(contents));
    
    this.syncUI();
    if (window.Haptics) window.Haptics.light();
  },

  syncUI() {
    const items = this.getContents();
    
    // Update Header Badge (ID from header.html)
    const badge = document.getElementById("cart-count");
    if (badge) {
      badge.textContent = items.length;
      badge.style.display = items.length > 0 ? "flex" : "none";
    }

    this.renderDrawer(items);
  },

  renderDrawer(items) {
    const container = document.getElementById("drawer-items");
    const totalEl = document.getElementById("drawer-total");
    
    if (totalEl) {
      const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
      totalEl.textContent = `£${total.toFixed(2)}`;
    }

    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:5rem 2rem; opacity:0.3;">VAULT EMPTY</div>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="cart-item" style="margin:0.5rem 1rem; padding:1rem; background:white; border:1px solid var(--ink-border); display:flex; align-items:center; border-radius:12px;">
        <div style="background:var(--grad-emerald); color:white; width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
          ${item.icon || '📦'}
        </div>
        <div style="margin-left:1rem; flex:1;">
          <div style="font-weight:800; font-size:0.9rem; color:var(--ink-display);">${item.title}</div>
          <div style="font-size:0.8rem; color:var(--accent-gold); font-weight:700;">£${(item.price || 0).toFixed(2)}</div>
        </div>
        <button onclick="KynarCart.remove('${item.id}')" style="background:var(--bg-canvas); border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; color:var(--ink-muted); font-weight:bold;">&times;</button>
      </div>
    `).join("");
  },

  openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    }
  },

  closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-visible");
      document.body.style.overflow = "";
    }
  },

  bumpCart() {
    const trigger = document.getElementById("cart-trigger");
    if (trigger) {
      trigger.style.transform = "scale(1.2) rotate(5deg)";
      setTimeout(() => trigger.style.transform = "scale(1) rotate(0deg)", 200);
    }
  }
};

window.KynarCart = KynarCart;

document.addEventListener("DOMContentLoaded", () => KynarCart.syncUI());
document.addEventListener("KynarHeaderLoaded", () => KynarCart.syncUI());
