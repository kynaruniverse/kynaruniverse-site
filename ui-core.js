/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V4.2 - AJAX Redirect Enabled)
   ══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   1. SYSTEM INITIALIZATION
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();
  initSmoothScroll();
  initRevealAnimations();
  initCustomCursor();
  initStudioHaptics();
  initNetworkPopup();
  syncCartBadge();

  // Delayed Triggers
  setTimeout(triggerActivityToast, 3000);
  handleUrlFilters();
  applyPreLaunchStatus();

  console.log("Kynar Studio: Core System Online");
});

/* ══════════════════════════════════════════════════════════════════════════
   2. COMPONENT INJECTORS
   ══════════════════════════════════════════════════════════════════════════ */

async function loadFooter() {
  const footerEl = document.getElementById("global-footer");
  if (!footerEl) return;

  try {
    const response = await fetch("components/footer.html");
    if (!response.ok) throw new Error("Footer not found");

    const html = await response.text();
    footerEl.innerHTML = html;
    console.log("Kynar Studio: Footer Synchronized");
  } catch (err) {
    console.error("Footer injection failed:", err);
  }
}

async function loadHeader() {
  const headerEl = document.getElementById("global-header");
  if (!headerEl) return;

  try {
    const response = await fetch("components/header.html");
    if (!response.ok) throw new Error("Header not found");

    const html = await response.text();
    headerEl.innerHTML = html;

    // Initialize Header Dependencies
    initCartBadge();
    initThemeEngine();
    initSmartHeader();
    console.log("Kynar Studio: Header Synchronized");
  } catch (err) {
    console.error("Header injection failed.");
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   3. CORE SYSTEMS: SCROLL, THEME, HEADER
   ══════════════════════════════════════════════════════════════════════════ */

function initSmoothScroll() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

function initSmartHeader() {
  const header = document.querySelector(".app-header");
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 80) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }
      lastScroll = currentScroll;
    },
    { passive: true }
  );
}

function initThemeEngine() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem("kynar_theme") || "light";
  if (currentTheme === "dark") document.body.classList.add("dark-mode");

  toggleBtn.onclick = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("kynar_theme", isDark ? "dark" : "light");

    // Kynar Signature Haptic: Light Pulse
    if (navigator.vibrate) navigator.vibrate(8);

    // Notify other components
    window.dispatchEvent(new Event("themeChanged"));
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   4. POPUP LOGIC & AJAX HANDLING
   ══════════════════════════════════════════════════════════════════════════ */

function initNetworkPopup() {
  const path = window.location.pathname;
  const isMainPage =
    path === "/" || path.includes("index") || path.includes("shop");

  if (!isMainPage || sessionStorage.getItem("kynar_popup_seen")) return;

  setTimeout(() => {
    if (document.getElementById("networkPopup")) return;

    // Template Literal: Indented for code readability
    const popupHTML = `
      <div class="network-popup-overlay" id="networkPopup">
        <div class="network-popup-card">
          <button class="close-popup">✕</button>
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.25em;">
            Kynar Studio
          </span>
          <h2 class="popup-title">Join the <br><span style="color: var(--ink-medium);">Kynar Community.</span></h2>
          <p style="font-size: 1rem; margin-bottom: 30px; line-height: 1.5;">
            Get the latest product drops, free templates, and creative tips.
          </p>

          <form id="networkForm">
            <input type="email" name="email" required placeholder="Enter your email" class="popup-input">
            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">
              Join Community
            </button>
          </form>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", popupHTML);
    const p = document.getElementById("networkPopup");
    p.classList.add("active");

    // --- AJAX FORM SUBMISSION ---
    const form = document.getElementById("networkForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const formData = new FormData(form);

      btn.disabled = true;
      btn.textContent = "Authorizing...";

      try {
        const response = await fetch("https://formspree.io/f/mlgekbwb", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          window.location.href = "success.html"; // Manual Redirect
        } else {
          alert("Submission failed. Please try again.");
          btn.disabled = false;
          btn.textContent = "Join Community";
        }
      } catch (err) {
        alert("Network error.");
        btn.disabled = false;
        btn.textContent = "Join Community";
      }
    });

    p.querySelector(".close-popup").onclick = () => {
      p.classList.remove("active");
      sessionStorage.setItem("kynar_popup_seen", "true");
    };
  }, 6000);
}

/* ══════════════════════════════════════════════════════════════════════════
   5. UI UTILITIES (Cart, Cursor, Haptics)
   ══════════════════════════════════════════════════════════════════════════ */

function initCartBadge() {
  const cartBtn = document.querySelector(".cart-trigger");
  if (!cartBtn || document.querySelector(".cart-wrapper")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "cart-wrapper";
  cartBtn.parentNode.insertBefore(wrapper, cartBtn);
  wrapper.appendChild(cartBtn);

  const badge = document.createElement("span");
  badge.className = "cart-count-badge";
  const savedCount = localStorage.getItem("kynar_cart_count") || "0";
  badge.innerText = savedCount;

  if (parseInt(savedCount) > 0) badge.classList.add("visible");
  wrapper.appendChild(badge);

  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest(".btn-primary, .btn-ghost");
    if (trigger) {
      badge.classList.add("visible");
      let newCount = parseInt(badge.innerText) + 1;
      badge.innerText = newCount;
      localStorage.setItem("kynar_cart_count", newCount);

      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    }
  });
}

function syncCartBadge() {
  const badge = document.querySelector(".cart-count-badge");
  const savedCount = localStorage.getItem("kynar_cart_count");

  if (badge && savedCount && parseInt(savedCount) > 0) {
    badge.innerText = savedCount;
    badge.classList.add("visible");
  }
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
}

function initCustomCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const dot = document.createElement("div");
  const outline = document.createElement("div");

  dot.className = "cursor-dot";
  outline.className = "cursor-outline";

  document.body.append(dot, outline);

  window.addEventListener("mousemove", (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    outline.animate(
      {
        transform: `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`,
      },
      { duration: 500, fill: "forwards" }
    );
  });
}

function initStudioHaptics() {
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!isMobile || !navigator.vibrate) return;

  document.body.addEventListener(
    "touchstart",
    (e) => {
      if (
        e.target.closest(".btn-primary, .btn-ghost, .nav-icon, .filter-chip")
      ) {
        navigator.vibrate(5);
      }
    },
    { passive: true }
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   6. FEATURES: SOCIAL PROOF & FILTERS
   ══════════════════════════════════════════════════════════════════════════ */

const activityLog = [
  "New Product Acquired: The Finance Tracker",
  "Someone joined the Kynar Community",
  "New Product Acquired: Aura Photo Filters",
  "Essential Starter Pack Claimed",
  "New Product Acquired: The Social Suite",
];

function triggerActivityToast() {
  let toast =
    document.querySelector(".activity-toast") || document.createElement("div");

  if (!toast.className) {
    toast.className = "activity-toast";
    toast.innerHTML = `<div class="activity-dot"></div><div class="activity-text"></div>`;
    document.body.appendChild(toast);
  }

  const textEl = toast.querySelector(".activity-text");
  let index = 0;

  setInterval(() => {
    textEl.textContent = activityLog[index];
    toast.classList.add("visible");

    setTimeout(() => {
      toast.classList.remove("visible");
      index = (index + 1) % activityLog.length;
    }, 5000);
  }, 15000);
}

function handleUrlFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("cat");

  if (category) {
    const targetBtn = document.querySelector(
      `.filter-chip[onclick*="'${category}'"]`
    );

    if (targetBtn) {
      filterGrid(category, targetBtn);
      setTimeout(() => {
        const shopSection = document.getElementById("shop");
        if (shopSection) {
          window.scrollTo({
            top: shopSection.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   7. NAVIGATION & STATE MANAGEMENT
   ══════════════════════════════════════════════════════════════════════════ */

// NOTE: These listeners run immediately (ensure script is deferred or at bottom of body)
const menuBtn = document.querySelector('.nav-icon[aria-label="Menu"]');
const closeBtn = document.getElementById("closeMenu");
const navOverlay = document.getElementById("navOverlay");

if (menuBtn && navOverlay) {
  menuBtn.onclick = () => {
    navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };
}

if (closeBtn && navOverlay) {
  closeBtn.onclick = () => {
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };
}

function applyPreLaunchStatus() {
  const cards = document.querySelectorAll(".product-card");

  // Surgically apply status from vault data instead of global override
  cards.forEach((card) => {
    const productId = card.querySelector("a")?.href.split("id=")[1];
    const product =
      typeof getProduct === "function" ? getProduct(productId) : null;

    if (product && product.status === "coming-soon") {
      card.setAttribute("data-status", "coming-soon");
    }
  });
}

// Auto-close menu on link click
document.querySelectorAll(".nav-menu-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navOverlay) {
      navOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});
