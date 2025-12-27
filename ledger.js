/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL LEDGER SYSTEM
 * ══════════════════════════════════════════════════════════════════════════
 * @description Responsible for rendering acquired artifacts (the user's library)
 * on the Identity Page. Reads from local storage history.
 * @module Ledger
 */

const Ledger = {
  // #region [ 1. INITIALIZATION ]

  /**
   * Initializes the Ledger system.
   * checks if the current page has the artifact list container.
   */
  init() {
    // Only run if we are on the Identity page and the list exists
    const listContainer = document.getElementById("artifact-list");
    if (!listContainer) return;

    this.renderPurchases(listContainer);
  },

  // #endregion

  // #region [ 2. DATA ACCESS ]

  /**
   * Retrieves the list of purchased items.
   * Currently reads from LocalStorage ('kynar_library').
   * Future V7.0 upgrade path: Fetch from Firestore (users/{uid}/purchases).
   * @returns {Array<Object>} List of purchased artifacts.
   */
  getPurchases() {
    return JSON.parse(localStorage.getItem("kynar_library") || "[]");
  },

  // #endregion

  // #region [ 3. RENDERING ENGINE ]

  /**
   * Renders the list of purchases into the DOM.
   * Handles both Empty State and Populated State.
   * @param {HTMLElement} container - The target container element.
   */
  renderPurchases(container) {
    const items = this.getPurchases();

    // --- State: Empty Ledger ---
    if (items.length === 0) {
      container.innerHTML = `
                <div class="stream-card" style="
                    align-items: center; 
                    flex-direction: column; 
                    gap: 1rem; 
                    height: auto; 
                    opacity: 0.8; 
                    padding: 3rem 1rem; 
                    text-align: center; 
                    width: 100%;
                ">
                    <div style="font-size: 2.5rem; opacity: 0.5;">📓</div>
                    <div>
                        <div class="stream-title">Ledger Empty</div>
                        <div class="stream-meta">You have not acquired any artifacts yet.</div>
                    </div>
                    <a href="archive.html" class="dock-btn" style="
                        font-size: 0.8rem; 
                        height: 36px; 
                        margin-top: 1rem;
                    ">
                        Visit Archive
                    </a>
                </div>
            `;
      return;
    }

    // --- State: Populated (Glass Tickets) ---
    container.innerHTML = items
      .map(
        (item) => `
            <div class="stream-card" style="
                align-items: center; 
                gap: 1rem; 
                height: auto; 
                padding: 1rem;
            ">
                
                <div class="stream-visual" style="
                    align-items: center; 
                    background: var(--grad-emerald); 
                    border-radius: 12px; 
                    color: white; 
                    display: flex; 
                    flex-shrink: 0; 
                    font-size: 1.2rem; 
                    height: 50px; 
                    justify-content: center; 
                    width: 50px;
                ">
                    ${item.icon || "✦"}
                </div>

                <div style="flex: 1;">
                    <div class="stream-title" style="font-size: 1rem;">
                        ${item.title}
                    </div>
                    <div class="stream-meta">
                        Acquired: ${item.acquiredDate || "Recently"}
                    </div>
                </div>

                <a 
                    class="dock-btn" 
                    download 
                    href="${item.downloadLink || "#"}" 
                    style="
                        background: transparent; 
                        border: 1px solid rgba(0,0,0,0.1); 
                        font-size: 0.75rem; 
                        height: 32px; 
                        padding: 0 1rem;
                    "
                >
                    Download
                </a>

            </div>
        `
      )
      .join("");
  },

  // #endregion
};

// #region [ 4. BOOT SEQUENCE ]

// Init on Load
document.addEventListener("DOMContentLoaded", () => Ledger.init());

// #endregion
