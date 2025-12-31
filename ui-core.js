/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V4.1 - Verified & Modular)
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    // 1. THE INJECTOR: Load components first
    loadHeader(); 
    loadFooter();
    
    // 2. THE PHYSICS: Independent systems
    initSmoothScroll();
    initRevealAnimations();
    initCustomCursor();
        initStudioHaptics();
    initNetworkPopup();
    
    // 3. PERSISTENCE: Restore session state
    syncCartBadge();
    
    // 4. SOCIAL PROOF: Initial trigger
    setTimeout(triggerActivityToast, 3000); 

    console.log("Kynar Studio: Core System Online");
});


// 0.1 FOOTER INJECTOR
async function loadFooter() {
    const footerEl = document.getElementById('global-footer');
    if (!footerEl) return;

    try {
        const response = await fetch('components/footer.html');
        if (!response.ok) throw new Error('Footer not found');
        const html = await response.text();
                footerEl.innerHTML = html;
        console.log("Kynar Studio: Footer Synchronized");

    } catch (err) {
        console.error("Footer injection failed:", err);
    }
}



// 0. COMPONENT LOADER (The Injector)
async function loadHeader() {
    const headerEl = document.getElementById('global-header');
    if (!headerEl) return;

    try {
        const response = await fetch('components/header.html');
        if (!response.ok) throw new Error('Header not found');
        const html = await response.text();
        headerEl.innerHTML = html;
        
        // 🔥 CRITICAL: These only work AFTER header is injected
        initMenuEngine();
        initCartBadge();
        initThemeEngine();
        initSmartHeader(); 
        
        console.log("Kynar Studio: Header Synchronized");

    } catch (err) {
        console.error("Header injection failed. Ensure 'components/header.html' exists.");
    }
}

// 1. LUXURIOUS SMOOTH SCROLL (Lenis)
function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }
}

// 2. SMART HEADER (Hides on Scroll)
function initSmartHeader() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 80) header.classList.add('hidden');
        else header.classList.remove('hidden');
        lastScroll = currentScroll;
    }, { passive: true });
}

// 3. OBSIDIAN THEME ENGINE (Dark Mode)
function initThemeEngine() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    if (localStorage.getItem('kynar_theme') === 'dark') document.body.classList.add('dark-mode');

    toggleBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('kynar_theme', isDark ? 'dark' : 'light');
        if (navigator.vibrate) navigator.vibrate(10); 
    };
}

// 4. GLOBAL MENU ENGINE
function initMenuEngine() {
    if (!document.querySelector('.nav-overlay')) {
        const menuHTML = `
            <div class="nav-overlay">
                <button class="close-menu nav-icon">✕</button>
                <ul class="nav-menu-list">
                    <li class="nav-menu-item" style="--i:1"><a href="index.html" class="nav-menu-link">Home</a></li>
                    <li class="nav-menu-item" style="--i:2"><a href="shop.html" class="nav-menu-link">Collection</a></li>
                    <li class="nav-menu-item" style="--i:3"><a href="newsletter.html" class="nav-menu-link">Network</a></li>
                    <li class="nav-menu-item" style="--i:4"><a href="contact.html" class="nav-menu-link">Concierge</a></li>
                </ul>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    const burger = document.querySelector('.nav-icon[aria-label="Menu"]');
    const overlay = document.querySelector('.nav-overlay');
    const close = document.querySelector('.close-menu');

    if (burger) {
        burger.onclick = () => { 
            overlay.classList.add('active'); 
            document.body.style.overflow = 'hidden'; 
        };
    }
    if (close) {
        close.onclick = () => { 
            overlay.classList.remove('active'); 
            document.body.style.overflow = ''; 
        };
    }
}

// 5. CART BADGE ENGINE
function initCartBadge() {
    const cartBtn = document.querySelector('.cart-trigger');
    if (!cartBtn || document.querySelector('.cart-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'cart-wrapper';
    cartBtn.parentNode.insertBefore(wrapper, cartBtn);
    wrapper.appendChild(cartBtn);

    const badge = document.createElement('span');
    badge.className = 'cart-count-badge';
    // Restore count from storage
    const savedCount = localStorage.getItem('kynar_cart_count') || '0';
    badge.innerText = savedCount;
    if (parseInt(savedCount) > 0) badge.classList.add('visible');
    
    wrapper.appendChild(badge);

    document.body.addEventListener('click', (e) => {
        // Only trigger on "Acquire" or "View" buttons
        const trigger = e.target.closest('.btn-primary, .btn-ghost');
        if (trigger) {
            badge.classList.add('visible');
            let newCount = parseInt(badge.innerText) + 1;
            badge.innerText = newCount;
            localStorage.setItem('kynar_cart_count', newCount);
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        }
    });
}

// Helper to keep badge synced across modular loads
function syncCartBadge() {
    const badge = document.querySelector('.cart-count-badge');
    const savedCount = localStorage.getItem('kynar_cart_count');
    if (badge && savedCount && parseInt(savedCount) > 0) {
        badge.innerText = savedCount;
        badge.classList.add('visible');
    }
}


// 6. THE NETWORK POPUP
function initNetworkPopup() {
    const path = window.location.pathname;
    const isMainPage = path === '/' || path.includes('index') || path.includes('shop');
    
    if (!isMainPage || sessionStorage.getItem('kynar_popup_seen')) return;

    setTimeout(() => {
        if (document.getElementById('networkPopup')) return;
        
        const popupHTML = `
            <div class="network-popup-overlay" id="networkPopup">
                <div class="network-popup-card">
                    <button class="close-popup">✕</button>
                    <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.25em;">The Network</span>
                    <h2 class="popup-title">Join the <br><span style="color: var(--ink-medium);">Kynar Community.</span></h2>
<p style="font-size: 1rem; margin-bottom: 30px; line-height: 1.5;">Get the latest product drops, free templates, and creative tips delivered to you.</p>

                    <form action="https://formspree.io/f/mlgekbwb" method="POST">
                        <input type="email" name="email" required placeholder="Enter your email" class="popup-input">
                        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">Authorize Access</button>
                    </form>
                </div>
            </div>`;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        const p = document.getElementById('networkPopup');
        p.classList.add('active');
        
        p.querySelector('.close-popup').onclick = () => {
            p.classList.remove('active');
            sessionStorage.setItem('kynar_popup_seen', 'true');
        };
    }, 6000);
}

// 7. UTILITIES
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('reveal-visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

function initCustomCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = document.createElement('div'), outline = document.createElement('div');
    dot.className = 'cursor-dot'; outline.className = 'cursor-outline';
    document.body.append(dot, outline);
    window.addEventListener('mousemove', (e) => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        outline.animate({ transform: `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)` }, { duration: 500, fill: "forwards" });
    });
}

function initStudioHaptics() {
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isMobile || !navigator.vibrate) return;
    document.body.addEventListener("touchstart", (e) => {
        if (e.target.closest('.btn-primary, .btn-ghost, .nav-icon, .filter-chip')) navigator.vibrate(5);
    }, { passive: true });
}

// --- HONEST SOCIAL PROOF ENGINE ---
const activityLog = [
    "New Asset Acquired: Finance Architect",
    "Someone joined The Network",
    "New Asset Acquired: Aura Presets",
    "Identity Verified: Starter Kit Claimed",
    "New Asset Acquired: Influence Suite"
];

function triggerActivityToast() {
    // Create element if it doesn't exist
    let toast = document.querySelector('.activity-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'activity-toast';
        toast.innerHTML = `
            <div class="activity-dot"></div>
            <div class="activity-text"></div>
        `;
        document.body.appendChild(toast);
    }

    const textEl = toast.querySelector('.activity-text');
    
    // Cycle through activityLog
    let index = 0;
    setInterval(() => {
        textEl.textContent = activityLog[index];
        toast.classList.add('visible');
        
        setTimeout(() => {
            toast.classList.remove('visible');
            index = (index + 1) % activityLog.length;
        }, 5000); // Show for 5 seconds

    }, 15000); // Trigger every 15 seconds
}
