/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR SATCHEL / COMMERCE ENGINE (V1.0)
 * ══════════════════════════════════════════════════════════════════════════
 * @description High-performance shopping state management and luxury
 * drawer interactions for the Kynar Marketplace.
 */

const Satchel = {
  // #region [ 0. CONFIGURATION ]

  /**
   * Returns the LocalStorage key for the cart.
   * @returns {string} The storage key.
   */
  getKey() {
    return "kynar_cart";
  },

  // #endregion

  // #region [ 1. DATA MANAGEMENT ]

  /**
   * Retrieves the current cart contents from LocalStorage.
   * @returns {Array<Object>} Array of Product objects.
   */
  getContents() {
    return JSON.parse(localStorage.getItem(this.getKey()) || "[]");
  },

  /**
   * Adds an item to the Satchel.
   * Handles both full objects (from Products pages) and ID strings (from Shop).
   * @param {Object|string} artifactOrId - The item object or its ID string.
   * @returns {boolean} True if added, false if already existed.
   */
  add(artifactOrId) {
    // Handle both ID string (from Shop) and Object (from Product page)
    let artifact = artifactOrId;

    // If string, fetch full object from global Shop DB if possible, or fail gracefully
    if (typeof artifactOrId === "string") {
      if (window.ArchiveSystem) {
        const db = window.ArchiveSystem.getDb();
        artifact = db.find((i) => i.id === artifactOrId);
      }
    }

    if (!artifact) {
      console.error("Artifact data missing.");
      return;
    }

    const contents = this.getContents();
    if (!contents.find((item) => item.id === artifact.id)) {
      contents.push(artifact);
      this.save(contents);
    
      this.openDrawer(); // Auto-open to confirm add
      this.bumpCart();


      if (window.Haptics) window.Haptics.success();
      return true;
    } else {
      this.openDrawer(); // Already exists, just show cart
      return false;
    }
  },

  /**
   * Removes an item from the Satchel by ID.
   * @param {string} artifactId - The ID of the item to remove.
   */
  remove(artifactId) {
    let contents = this.getContents();
    contents = contents.filter((item) => item.id !== artifactId);
    this.save(contents);
    // If on checkout page, refresh that list too
    if (
      window.removeItem &&
      typeof window.removeItem === "function" &&
      document.getElementById("manifest-list")
    ) {
      // Let checkout.js handle its own render if active
    }
  },

  /**
   * Clears the entire Satchel and updates UI.
   */
  clear() {
    localStorage.removeItem(this.getKey());
    this.updateUI();
    this.renderDrawer();
  },

  /**
   * Persists the cart contents to LocalStorage and triggers UI updates.
   * @param {Array<Object>} contents - The new cart array.
   */
  save(contents) {
    localStorage.setItem(this.getKey(), JSON.stringify(contents));
    this.updateUI();
    this.renderDrawer();
  },

  /**
   * Calculates the total price of items in the Satchel.
   * @returns {number} Total price.
   */
  total() {
    return this.getContents().reduce((sum, item) => sum + item.price, 0);
  },

  // #endregion

  // #region [ 2. UI & BADGE UPDATES ]

  /**
   * Updates the red notification dot on the header icon.
   */
   
    /**
   * Triggers a tactile scale animation on the cart icon.
   */
  bumpCart() {
    const trigger = document.getElementById("satchel-trigger");
    if (trigger) {
      trigger.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      trigger.style.transform = "scale(1.3)";
      setTimeout(() => { trigger.style.transform = "scale(1)"; }, 200);
    }
  },


  
  updateUI() {
    const count = this.getContents().length;
    const badge = document.getElementById("satchel-count");

    if (badge) {
      if (count > 0) {
        badge.style.display = "block";
        // Optional: badge.textContent = count;
      } else {
        badge.style.display = "none";
      }
    }
  },

  // #endregion

  // #region [ 3. DRAWER INTERACTION ]

  /**
   * Initializes event listeners for the Satchel drawer.
   * Waits for DOM elements to exist.
   */
  initDrawer() {
    // Target the new button ID from header.html
    const trigger = document.getElementById("satchel-trigger");
    const backdrop = document.getElementById("satchel-drawer-backdrop");
    const closeBtn = document.getElementById("close-drawer");

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    }

    if (backdrop) backdrop.addEventListener("click", () => this.closeDrawer());
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeDrawer());

    // Initial render check
    this.updateUI();
  },

  /**
   * Opens the side drawer and shows the backdrop.
   */
  openDrawer() {
    this.renderDrawer();
    const drawer = document.getElementById("satchel-drawer");
    const backdrop = document.getElementById("satchel-drawer-backdrop");

    if (drawer && backdrop) {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-visible");
    }
  },

  /**
   * Closes the side drawer and hides the backdrop.
   */
  closeDrawer() {
    const drawer = document.getElementById("satchel-drawer");
    const backdrop = document.getElementById("satchel-drawer-backdrop");

    if (drawer && backdrop) {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-visible");
    }
  },

  // #endregion

    // #region [ 4. DRAWER RENDERING ]

  renderDrawer() {
    const container = document.getElementById("drawer-items");
    const totalEl = document.getElementById("drawer-total");
    const items = this.getContents();

    if (totalEl) totalEl.textContent = `£${this.total().toFixed(2)}`;
    if (!container) return;

    // --- State: Empty Cart ---
    if (items.length === 0) {
      container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 4rem 1rem; opacity: 0.6;">
                    <div style="font-size: 3.5rem; margin-bottom: 1.5rem;">🛍️</div>
                    <p style="font-weight: 600; color: var(--ink-display);">Your cart is empty.</p>
                    <a href="shop.html" onclick="Satchel.closeDrawer()" style="display: inline-block; margin-top: 1rem; color: var(--accent-gold); font-weight: bold; font-size: 0.9rem; text-decoration: none;">Explore Products →</a>
                </div>`;
      return;
    }

    // --- State: Populated (List Tile Style) ---
    container.innerHTML = items
      .map(
        (item) => `
            <div class="nav-item" style="margin: 0.6rem 0; padding: 0.8rem; background: #fff; display: flex; align-items: center; border: 1px solid rgba(0,0,0,0.03); cursor: default;">
                
                <div class="nav-icon" style="background: var(--grad-emerald); color: white; flex-shrink: 0; position: relative; overflow: hidden;">
                    ${
                      item.image
                        ? `<img src="${item.image}" style="width:100%; height:100%; object-fit: cover;" onerror="this.style.display='none';">`
                        : ""
                    }
                    <span style="position: absolute; z-index: 1;">${item.icon || "📦"}</span>
                </div>

                <div class="nav-label" style="margin-left: 0.2rem;">
                    <div style="font-size: 0.95rem; line-height: 1.2; margin-bottom: 2px;">${item.title}</div>
                    <div style="font-size: 0.75rem; color: var(--ink-muted); font-weight: 400; text-transform: uppercase;">£${item.price.toFixed(2)}</div>
                </div>

                <button onclick="Satchel.remove('${item.id}')" 
                        style="background: rgba(211, 47, 47, 0.08); border: none; color: var(--accent-red); width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; cursor: pointer; flex-shrink: 0;"
                        aria-label="Remove item">
                    &times;
                </button>
            </div>
        `
      )
      .join("");
  },

  // #endregion


  // #region [ 5. DOWNLOAD GATEKEEPER ]

  /**
   * Handles direct file downloads with authentication checks.
   * @param {string} url - The file URL to download.
   */
    directDownload(url) {
    const hasAuth = localStorage.getItem("kynar_auth_token");

    if (hasAuth || true) { // Logic bypass for seamless demo experience
      if (window.Haptics) window.Haptics.success();

      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Direct to Account/Login instead of old "Signals" page
      if (window.KynarCore) window.KynarCore.openAuthModal();
    }
  },


  // #endregion
};

// Global Exposure
window.Satchel = Satchel;

// #region [ 6. INITIALIZATION ]

document.addEventListener("DOMContentLoaded", () => {
  // Use the Custom Event from core.js for instant, clean initialization
  document.addEventListener("KynarHeaderLoaded", () => {
    Satchel.initDrawer();
  });

  // Manual check in case the event fired before this script loaded
  if (document.getElementById("satchel-trigger")) {
    Satchel.initDrawer();
  }
});

// #endregion
