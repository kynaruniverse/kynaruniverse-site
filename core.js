/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL CORE SYSTEM
 * ══════════════════════════════════════════════════════════════════════════
 * @description Central system controller. Handles dynamic HTML component loading
 * (Header/Footer injection), global navigation state, and system-wide modals.
 * @module ForgeCore
 */

const ForgeCore = {
  // #region [ 1. COMPONENT LOADER ]

  /**
   * Scans the DOM for elements with `data-include`.
   * Fetches the target HTML file, injects it, and re-hydrates any scripts.
   * Dispatches events when specific critical components (Header, Modals) load.
   * @returns {Promise<void>}
   */
  async loadComponents() {
    const elements = document.querySelectorAll("[data-include]");

    const promises = Array.from(elements).map(async (el) => {
      const file = el.dataset.include;
      try {
        const response = await fetch(file);
        if (response.ok) {
          const html = await response.text();
          el.innerHTML = html;

          // Re-hydrate scripts found in the injected HTML
          this.executeScripts(el);

          // SIGNAL: Header Ready
          if (file.includes("header")) {
            document.dispatchEvent(new Event("ForgeHeaderLoaded"));
          }

          // SIGNAL: Modals Ready
          if (file.includes("modals")) {
            document.dispatchEvent(new Event("ForgeModalsLoaded"));
          }
        } else {
          console.error(`Forge: Failed to load ${file}`);
        }
      } catch (err) {
        console.error(`Forge: System Error loading ${file}`, err);
      }
    });

    await Promise.all(promises);
  },

  /**
   * Helper to execute JavaScript found inside dynamically injected HTML.
   * Browsers do not execute <script> tags in innerHTML by default.
   * @param {HTMLElement} container - The container with the injected HTML.
   */
  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },

  // #endregion

  // #region [ 2. NAVIGATION CONTROLLER (MAIN MENU) ]

  /**
   * Initializes the global navigation drawer logic.
   * Binds click listeners to the hamburger menu and backdrop.
   */
  initNavigation() {
    const trigger = document.getElementById("nav-toggle");
    const drawer = document.getElementById("nav-drawer");
    const backdrop = document.getElementById("nav-backdrop");
    const closeBtn = document.getElementById("close-nav");

    if (!trigger || !drawer) return;

    const openMenu = () => {
      drawer.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-visible");
      document.body.style.overflow = "hidden"; // Lock Scroll
    };

    const closeMenu = () => {
      drawer.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-visible");
      document.body.style.overflow = ""; // Unlock Scroll
    };

    trigger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
  },

  // #endregion

  // #region [ 3. GLOBAL MODAL CONTROLLER ]

  /**
   * Initializes global modal listeners.
   * Uses event delegation to allow any button with `.trigger-access` to open the auth modal.
   */
  initModals() {
    // Listen for any button with class .trigger-access
    // This allows buttons anywhere (Header, Identity page, Library) to open the auth modal
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".trigger-access")) {
        e.preventDefault();
        this.openAuthModal();
      }
    });

    // Modal Close Logic
    const overlay = document.getElementById("modal-overlay");
    const closeBtn = document.getElementById("close-access");

    if (overlay) {
      const closeModal = () => {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
      };

      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      // Close on background click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
    }
  },

  /**
   * Programmatically opens the Authentication Modal.
   */
  openAuthModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.style.visibility = "visible";
      overlay.style.opacity = "1";
    } else {
      console.warn(
        "Forge: Modal overlay not found. Ensure components/modals.html is loaded."
      );
    }
  },

  // #endregion
};

// #region [ 4. SYSTEM BOOT SEQUENCE ]

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Load Shell (Header, Footer, Modals)
  await ForgeCore.loadComponents();

  // 2. Initialize Subsystems
  ForgeCore.initNavigation();
  ForgeCore.initModals();

  // 3. Log Status
  console.log("Soft Royal Engine: Online");
});

// Expose for external access if needed
window.ForgeCore = ForgeCore;

// #endregion
