/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL EXCHANGE LOGIC
 * ══════════════════════════════════════════════════════════════════════════
 * @description Handles the checkout page logic: rendering the manifest (cart),
 * calculating totals, removing items, and processing the final transaction.
 * @module CheckoutSystem
 */

document.addEventListener("DOMContentLoaded", () => {
  // #region [ 1. CONFIGURATION & INITIALIZATION ]

  const DOM = {
    list: document.getElementById("manifest-list"),
    count: document.getElementById("summary-count"),
    total: document.getElementById("summary-total"),
    btn: document.getElementById("btn-acquire"),
  };

  /**
   * Initializes the checkout page.
   * Renders the current satchel contents and attaches event listeners.
   */
  function init() {
    // Render items on load
    renderManifest();

    // Attach listener
    if (DOM.btn) {
      DOM.btn.addEventListener("click", processExchange);
    }
  }

  // #endregion

  // #region [ 2. RENDERING ENGINE ]

  /**
   * Renders the list of items (Manifest) or the Empty State.
   * Updates the summary card totals dynamically.
   */
  function renderManifest() {
    // Safely get data from the global Satchel system
    const items = window.Satchel ? window.Satchel.getContents() : [];
    const total = window.Satchel ? window.Satchel.total() : 0;

    // --- Update Summary Card ---
    if (DOM.count) DOM.count.textContent = items.length;
    if (DOM.total) DOM.total.textContent = `£${total.toFixed(2)}`;

    // --- State: Empty Satchel ---
    if (items.length === 0) {
      DOM.list.innerHTML = `
                <div class="feature-card" style="background: var(--grad-silver); height: auto; align-items: center; text-align: center; padding: 4rem 2rem; border: 1px dashed rgba(0,0,0,0.1); box-shadow: none;">
                    <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">👜</div>
                    <h3 style="font-family: 'Bantayog'; margin-bottom: 0.5rem; color: var(--ink-display);">Satchel Empty</h3>
                    <p style="font-size: 0.9rem; color: var(--ink-muted); margin-bottom: 2rem;">
                        You have not gathered any artifacts yet.
                    </p>
                    <a href="archive.html" class="dock-btn" style="height: 50px; padding: 0 2rem; width: auto;">
                        Return to Archive
                    </a>
                </div>
            `;

      // Disable Checkout Button
      if (DOM.btn) {
        DOM.btn.style.opacity = "0.5";
        DOM.btn.style.pointerEvents = "none";
        DOM.btn.innerHTML = "Satchel Empty";
      }
      return;
    }

    // --- State: Populated Manifest ---
    DOM.list.innerHTML = items
      .map(
        (item) => `
            <div class="manifest-item">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="stream-visual" style="background: var(--grad-emerald); font-size: 1.2rem; width: 40px; height: 40px;">✦</div>
                    
                    <div>
                        <div style="font-family: 'Bantayog'; font-size: 1.1rem; color: var(--ink-display); line-height: 1;">${
                          item.title
                        }</div>
                        <div style="font-size: 0.8rem; color: var(--ink-muted); margin-top: 4px;">${
                          item.collection || "System Artifact"
                        }</div>
                    </div>
                </div>

                <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--ink-display); font-family: 'Glacial Indifference';">£${item.price.toFixed(
                      2
                    )}</div>
                    <button onclick="removeItem('${
                      item.id
                    }')" style="background: none; border: none; color: var(--accent-red); font-size: 0.75rem; cursor: pointer; opacity: 0.7; margin-top: 4px; padding: 0;">
                        Remove
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    // Re-enable button if items exist
    if (DOM.btn) {
      DOM.btn.style.opacity = "1";
      DOM.btn.style.pointerEvents = "all";
      DOM.btn.innerHTML =
        '<span style="color: var(--accent-red);">🔒</span> Confirm Exchange';
    }
  }

  // #endregion

  // #region [ 3. TRANSACTION LOGIC ]

  /**
   * Global helper to remove an item from the manifest.
   * Exposed to window so the HTML `onclick` attributes can find it.
   * @param {string} id - The ID of the artifact to remove.
   */
  window.removeItem = (id) => {
    if (window.Satchel) {
      window.Satchel.remove(id);
      renderManifest(); // Re-render to update price/list

      // Trigger Header update event via ForgeUtils (if available)
      if (window.ForgeUtils) window.ForgeUtils.updateSatchelCount();
    }
  };

  /**
   * Processes the mock transaction.
   * Simulates an API delay, moves items to "Library" storage, and redirects.
   */
  function processExchange() {
    const btn = document.getElementById("btn-acquire");

    // 1. Loading State
    btn.innerHTML =
      '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Securing Assets...';
    btn.style.opacity = "0.8";
    btn.style.pointerEvents = "none";

    // Simulation of Secure API Transaction
    setTimeout(() => {
      // 2. Get Current Satchel Data
      const newItems = window.Satchel.getContents();

      // 3. Get Existing Library (Owned items)
      const currentLibrary = JSON.parse(
        localStorage.getItem("kynar_library") || "[]"
      );

      // 4. Merge (Avoid duplicates)
      let addedCount = 0;
      newItems.forEach((newItem) => {
        if (!currentLibrary.find((owned) => owned.id === newItem.id)) {
          newItem.acquiredDate = new Date().toLocaleDateString();
          currentLibrary.push(newItem);
          addedCount++;
        }
      });

      // 5. Save to Permanent Storage
      localStorage.setItem("kynar_library", JSON.stringify(currentLibrary));

      // 6. Success Feedback
      btn.innerHTML = "✔ Exchange Complete";
      btn.style.background = "#10B981"; // Emerald Success
      btn.style.color = "white";

      if (window.Haptics) window.Haptics.success();

      // 7. Clear Satchel & Redirect
      setTimeout(() => {
        window.Satchel.clear();
        window.location.href = "identity.html"; // Or success.html
      }, 800);
    }, 1500);
  }

  // #endregion

  // Start the system
  init();
});
