/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL ARCHIVE LOGIC
 * ══════════════════════════════════════════════════════════════════════════
 * @description Manages the digital artifact vault, handles client-side filtering
 * and search, and renders the glass card grid dynamically.
 * @module ArchiveSystem
 */

const ArchiveSystem = (() => {
  // #region [ 1. THE ARTIFACT VAULT (DATABASE) ]

  /**
   * The local "database" of all digital products.
   * In a production app, this would be fetched from Firestore.
   */
  const ARTIFACTS = [
    {
      id: "art_001",
      title: "Kynar Daily Planner",
      collection: "productivity",
      price: 0.0,
      image: "images/1/planner-cover.webp",
      icon: "📅", // Fallback icon
      tag: "PDF Planner",
      downloadLink: "assets/kynar-daily-planner.pdf",
    },
    {
      id: "art_002",
      title: "10 AI Prompts",
      collection: "automation",
      price: 0.0,
      image: "images/1/ai-cover.webp",
      icon: "🤖",
      tag: "Prompt Pack",
      downloadLink: "assets/10-ai-prompts.pdf",
    },
    {
      id: "art_003",
      title: "Python Cheatsheet",
      collection: "automation",
      price: 0.0,
      image: "images/1/python-cover.webp",
      icon: "🐍",
      tag: "Reference Guide",
      downloadLink: "assets/python-basic-cheatsheet.pdf",
    },
    {
      id: "art_004",
      title: "Worldbuilding Checklist",
      collection: "creative",
      price: 0.0,
      image: "images/1/world-cover.webp",
      icon: "🌍",
      tag: "Creative Tool",
      downloadLink: "assets/worldbuilding-checklist.pdf",
    },
  ];

  const DOM = {
    grid: document.getElementById("artifact-grid"),
    search: document.getElementById("archive-search"),
    filters: document.querySelectorAll("#filter-stream button"),
  };

  // #endregion

  // #region [ 2. THE RENDERER (GLASS CARD ENGINE) ]

  const Renderer = {
    /**
     * Clears the grid and renders a list of items with a fade-in animation.
     * @param {Array} items - The filtered list of artifacts.
     */
    buildGrid(items) {
      if (!DOM.grid) return;

      // Animation: Fade Out
      DOM.grid.style.opacity = "0";
      DOM.grid.style.transform = "translateY(10px)";
      DOM.grid.style.transition = "opacity 0.3s ease, transform 0.3s ease";

      setTimeout(() => {
        DOM.grid.innerHTML = "";

        // --- State: Empty Results ---
        if (items.length === 0) {
          DOM.grid.innerHTML = `
                        <div class="stream-card" style="width: 100%; height: 200px; grid-column: 1 / -1; align-items: center; justify-content: center; opacity: 0.7; pointer-events: none;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🌫️</div>
                            <div style="font-family: 'Bantayog'; font-size: 1.2rem;">Vault Empty</div>
                            <div style="font-size: 0.9rem;">No artifacts match your query.</div>
                        </div>`;
        } else {
          // --- State: Populated ---
          items.forEach((item) => {
            const html = this.createCard(item);
            DOM.grid.insertAdjacentHTML("beforeend", html);
          });
        }

        // Animation: Fade In
        DOM.grid.style.opacity = "1";
        DOM.grid.style.transform = "translateY(0)";
      }, 300);
    },

    /**
     * Generates the HTML string for a single artifact card.
     * Handles image fallbacks and dynamic button logic (Free vs Paid).
     * @param {Object} item - The artifact data object.
     * @returns {string} The HTML string.
     */
    createCard(item) {
      const formattedPrice =
        item.price === 0 ? "Free" : `£${item.price.toFixed(2)}`;

      // Determine Link: If it's the Deep Focus OS (art_001), link to artifact.html
      // Otherwise, link to # (or duplicate artifact.html for others later)
      const detailLink = item.id === "art_001" ? "artifact.html" : "#";

      // Visual Block: Image or Icon Fallback
      const visualBlock = item.image
        ? `<a href="${detailLink}" style="display:block; width:100%; height:100%;">
             <img src="${
               item.image
             }" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 3rem; background: var(--grad-silver); color: var(--ink-muted);">${
               item.icon || "📦"
             }</div>
           </a>`
        : `<a href="${detailLink}" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--grad-silver); color: var(--ink-muted); text-decoration:none;">${
            item.icon || "📦"
          }</a>`;

      // Action Button Logic (Download vs Gather)
      // We use global window.Satchel to ensure state is shared
      const actionBtn =
        item.price === 0
          ? `<button onclick="window.Satchel.directDownload('${item.downloadLink}')" class="dock-btn" style="height: 32px; padding: 0 1rem; font-size: 0.75rem; border: 1px solid var(--ink-muted); background: transparent;">↓ Download</button>`
          : `<button onclick="window.Satchel.add('${item.id}')" class="dock-btn" style="height: 32px; padding: 0 1rem; font-size: 0.75rem; background: var(--grad-gold); color: white; border: none;">+ Add</button>`;

      return `
            <div class="stream-card" style="height: auto; min-height: 260px; overflow: hidden; padding: 0;">
                
                <div class="stream-visual" style="width: 100%; height: 140px; border-radius: 0; margin-bottom: 0; position: relative; overflow: hidden;">
                    ${visualBlock}
                    <span style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase; color: var(--ink-display);">
                        ${item.collection}
                    </span>
                </div>

                <div style="padding: 1rem; display: flex; flex-direction: column; flex: 1;">
                    <div class="stream-title" style="font-size: 1rem; margin-bottom: 0.25rem;">${
                      item.title
                    }</div>
                    <div class="stream-meta" style="margin-bottom: 1rem;">${
                      item.tag
                    }</div>
                    
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: var(--ink-display); font-family: 'Glacial Indifference';">${formattedPrice}</span>
                        ${actionBtn}
                    </div>
                </div>

            </div>
            `;
    },
  };

  // #endregion

  // #region [ 3. CONTROLLER ]

  const Controller = {
    /**
     * Initializes the Archive system.
     * Checks URL params for initial filters and binds events.
     */
    init() {
      if (DOM.grid) {
        // Check URL params for collection filter (e.g., from Index page pills)
        const urlParams = new URLSearchParams(window.location.search);
        // Handle both filter and tag params
        const filterParam = urlParams.get("filter") || urlParams.get("tag");

        if (filterParam) {
          this.applyFilter(filterParam);
          this.highlightFilter(filterParam);
        } else {
          Renderer.buildGrid(ARTIFACTS);
        }

        this.bindEvents();
      }
      console.log("Soft Royal Archive: Active");
    },

    /**
     * Binds listeners to Search Input and Filter Chips.
     */
    bindEvents() {
      // Search Listener
      if (DOM.search) {
        DOM.search.addEventListener("input", (e) => {
          const term = e.target.value.toLowerCase();
          const filtered = ARTIFACTS.filter(
            (i) =>
              i.title.toLowerCase().includes(term) ||
              i.collection.includes(term) ||
              i.tag.toLowerCase().includes(term)
          );
          Renderer.buildGrid(filtered);
        });
      }

      // Filter Chip Listeners
      if (DOM.filters) {
        DOM.filters.forEach((btn) => {
          btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            this.highlightFilter(filter);
            this.applyFilter(filter);
          });
        });
      }
    },

    /**
     * Filters the dataset and triggers a re-render.
     * @param {string} filter - The collection name or 'all'.
     */
    applyFilter(filter) {
      let result =
        filter === "all"
          ? ARTIFACTS
          : ARTIFACTS.filter(
              (i) =>
                i.collection.toLowerCase() === filter.toLowerCase() ||
                i.tag.toLowerCase().includes(filter.toLowerCase())
            );
      Renderer.buildGrid(result);
    },

    /**
     * Updates the visual state of the filter buttons.
     * @param {string} filterName - The name of the active filter.
     */
    highlightFilter(filterName) {
      DOM.filters.forEach((b) => {
        // Reset all
        b.style.background = "transparent";
        b.style.color = "var(--ink-body)";
        b.style.border = "1px solid rgba(0,0,0,0.05)";

        // Activate target
        if (
          b.dataset.filter === filterName ||
          (filterName === "all" && b.dataset.filter === "all")
        ) {
          b.style.background = "var(--grad-gold)";
          b.style.color = "white";
          b.style.border = "none";
        }
      });
    },
  };

  // #endregion

  // Helper to allow external access to the full database if needed
  return {
    init: Controller.init,
    getDb: () => ARTIFACTS,
  };
})();

document.addEventListener("DOMContentLoaded", ArchiveSystem.init);
