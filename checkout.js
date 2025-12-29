/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR CHECKOUT CONTROLLER (SUPABASE EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 * @description Manages order processing and records purchases to Supabase.
 */

import { supabase } from './supabase-config.js';

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. DOM SELECTORS
  const DOM = {
    list: document.getElementById("order-list"),
    count: document.getElementById("summary-count"),
    total: document.getElementById("summary-total"), 
    payBtnTotal: document.getElementById("pay-btn-amount"),
    btn: document.getElementById("btn-pay"),
    errorMsg: document.getElementById("checkout-error") // Add this ID to HTML later if needed
  };

  // 2. HELPER: PRICE CALCULATOR
  function getCartTotal() {
    const items = window.KynarCart ? window.KynarCart.getContents() : [];
    return items.reduce((sum, item) => sum + Number(item.price), 0);
  }

  // 3. RENDER SUMMARY (UI)
  function renderOrderSummary() {
    const items = window.KynarCart ? window.KynarCart.getContents() : [];
    const totalVal = getCartTotal();
    const formattedTotal = `£${totalVal.toFixed(2)}`;

    // Update Counters
    if (DOM.count) DOM.count.textContent = items.length;
    if (DOM.total) DOM.total.textContent = formattedTotal;
    if (DOM.payBtnTotal) DOM.payBtnTotal.textContent = formattedTotal;

    if (!DOM.list) return;

    // A. Empty Cart State
    if (items.length === 0) {
      DOM.list.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; border: 2px dashed var(--ink-border); border-radius: 16px; opacity: 0.6;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">Cart Empty</h3>
          <a href="shop.html" class="dock-btn" style="display:inline-flex; text-decoration:none; background:var(--ink-display);">Return to Shop</a>
        </div>`;
      
      if (DOM.btn) {
        DOM.btn.style.opacity = "0.5";
        DOM.btn.style.pointerEvents = "none";
        DOM.btn.textContent = "Cart is Empty";
      }
      return;
    }

    // B. Render Items
    DOM.list.innerHTML = items.map(item => `
      <div class="checkout-item" style="display:flex; justify-content:space-between; align-items:center; padding: 1.5rem 0; border-bottom: 1px solid var(--ink-border);">
        <div style="display: flex; gap: 1.25rem; align-items: center;">
          <div style="background: ${item.bg || 'var(--ink-display)'}; color: white; width: 56px; height: 56px; border-radius: 12px; display:flex; align-items:center; justify-content:center; font-size: 1.5rem;">
            ${item.icon || '📦'}
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 1.1rem; color: var(--ink-display); margin-bottom: 4px;">${item.title}</div>
            <div style="font-size: 0.75rem; color: var(--ink-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Digital Asset</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: var(--ink-display); font-size: 1.1rem;">£${Number(item.price).toFixed(2)}</div>
          <button onclick="removeCheckoutItem('${item.id}')" style="background: none; border: none; color: var(--accent-red); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer; margin-top: 4px; opacity: 0.7;">
            Remove
          </button>
        </div>
      </div>
    `).join("");

    // Enable Button
    if (DOM.btn) {
      DOM.btn.style.opacity = "1";
      DOM.btn.style.pointerEvents = "all";
      DOM.btn.innerHTML = `Complete Order <span style="opacity:0.6; margin-left:8px;">£${totalVal.toFixed(2)}</span>`;
    }
  }

  // 4. PURCHASE LOGIC (SUPABASE)
  async function processPurchase() {
    const total = getCartTotal();
    const btn = DOM.btn;

    // Loading State
    btn.innerHTML = '<span class="spinner"></span> Verifying...';
    btn.disabled = true;

    try {
      // Step 1: Check Auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("🔒 Please log in or create an account to verify ownership.");
        // Optional: Open login modal or redirect
        window.location.href = "index.html"; // Simple redirect for now
        return;
      }

      // Step 2: Handle Payments
      // IF TOTAL > 0, WE WOULD TRIGGER STRIPE HERE.
      // FOR NOW, WE ASSUME FREE OR "TEST MODE" FOR PAID ITEMS.
      if (total > 0) {
        // Since we are "Free Build", we will allow "simulated" payment for now
        // so you can test the flow. In production, you'd block this.
        console.log("Simulating Payment for:", total);
      }

      // Step 3: Record Ownership in Supabase 'purchases' table
      const items = window.KynarCart.getContents();
      
      // Prepare rows for insertion
      const purchaseRecords = items.map(item => ({
        user_id: user.id,
        product_id: Number(item.id), // Ensure matches DB Type
        created_at: new Date()
      }));

      // Insert into Supabase
      const { error } = await supabase
        .from('purchases')
        .insert(purchaseRecords);

      if (error) throw error;

      // Step 4: Success
      window.KynarCart.clear();
      window.location.href = "success.html";

    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Transaction Failed: " + err.message);
      btn.innerHTML = "Try Again";
      btn.disabled = false;
    }
  }

  // 5. GLOBAL HANDLER (Remove Item)
  window.removeCheckoutItem = (id) => {
    if (window.KynarCart) {
      window.KynarCart.remove(id);
      renderOrderSummary();
    }
  };

  // 6. INIT
  renderOrderSummary();
  if (DOM.btn) DOM.btn.addEventListener("click", processPurchase);

});
