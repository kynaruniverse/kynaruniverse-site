/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V3.2)
   Mobile-First Intelligence, Physics, Tactile Feedback & Menu Engine
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initSmartHeader();
    initCustomCursor();
    initRevealAnimations();
    initAtelierHaptics();
    initMenuEngine();
    initCartBadge();
    initNetworkPopup();
    console.log("Kynar Atelier: System Fully Calibrated");
});

// 1. LUXURIOUS SMOOTH SCROLL (Lenis)
function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

// 2. SMART HEADER (Hides on Scroll Down, Shows on Up)
function initSmartHeader() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    
    let lastScroll = 0;
    const threshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }
        if (currentScroll > lastScroll && currentScroll > threshold) {
            header.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
            header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });
}

// 3. MAGNETIC CURSOR (Desktop Only)
function initCustomCursor() {
    if (window.matchMedia("(pointer: fine)").matches) {
        const dot = document.createElement('div');
        const outline = document.createElement('div');
        dot.className = 'cursor-dot';
        outline.className = 'cursor-outline';
        document.body.appendChild(dot);
        document.body.appendChild(outline);

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            dot.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
            outline.animate({
                transform: `translate(${posX}px, ${posY}px) translate(-50%, -50%)`
            }, { duration: 500, fill: "forwards" });
        });
    }
}

// 4. SCROLL REVEAL (Elements float in)
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

// 5. ATELIER TACTILE ENGINE (Vibration Feedback)
function initAtelierHaptics() {
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isMobile || !navigator.vibrate) return;

    const atelierTargets = [
        '.btn-primary', 
        '.btn-ghost', 
        '.product-card', 
        '.nav-icon', 
        '.filter-chip',
        '.nav-menu-link'
    ];

    document.body.addEventListener("touchstart", (e) => {
        if (e.target.closest(atelierTargets.join(","))) {
            navigator.vibrate(5); 
        }
    }, { passive: true });
}

// 6. GLOBAL MENU ENGINE (Dynamic Overlay Navigation)
function initMenuEngine() {
    // 1. Create Overlay if missing
    if (!document.querySelector('.nav-overlay')) {
        const menuHTML = `
            <div class="nav-overlay">
                <button class="close-menu nav-icon" aria-label="Close Menu">✕</button>
                <ul class="nav-menu-list">
                    <li class="nav-menu-item" style="--i:1"><a href="index.html" class="nav-menu-link">Home</a></li>
                    <li class="nav-menu-item" style="--i:2"><a href="shop.html" class="nav-menu-link">Collection</a></li>
                    <li class="nav-menu-item" style="--i:3"><a href="newsletter.html" class="nav-menu-link">Network</a></li>
                    <li class="nav-menu-item" style="--i:4"><a href="contact.html" class="nav-menu-link">Concierge</a></li>
                </ul>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }
    
    // 7. CART BADGE ENGINE
function initCartBadge() {
    const cartBtn = document.querySelector('.nav-icon[aria-label="Cart"]');
    if (!cartBtn) return;

    // Wrap the button in a div to hold the badge
    const wrapper = document.createElement('div');
    wrapper.className = 'cart-wrapper';
    cartBtn.parentNode.insertBefore(wrapper, cartBtn);
    wrapper.appendChild(cartBtn);

    // Create the badge
    const badge = document.createElement('span');
    badge.className = 'cart-count-badge';
    badge.innerText = '0';
    wrapper.appendChild(badge);

    // Listen for Lemon Squeezy Events
    window.createLemonSqueezy = function() {
        window.LemonSqueezy.Setup({
            eventHandler: (event) => {
                if (event.event === 'Checkout.Success') {
                    // Reset cart count on success
                    updateBadge(0);
                }
            }
        });
    };

    // Since Lemon Squeezy doesn't provide a "item added" callback for simple overlays,
    // we trigger a visual "pulse" whenever the buy buttons are clicked.
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.btn-primary') || e.target.closest('.btn-ghost')) {
            // This is a placeholder for your product addition logic
            // For now, it provides visual feedback that the system is working
            badge.classList.add('visible');
            let current = parseInt(badge.innerText);
            badge.innerText = current + 1;
            
            // Haptic feedback for "Added to Cart"
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        }
    });
}

// 8. THE NETWORK POPUP ENGINE
function initNetworkPopup() {
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('shop.html') || window.location.pathname === '/';
    if (!isMainPage || sessionStorage.getItem('kynar_popup_seen')) return;

    const popupHTML = `
        <div class="network-popup-overlay" id="networkPopup">
            <div class="network-popup-card">
                <button class="close-popup" aria-label="Dismiss">✕</button>
                
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.25em;">The Network</span>
                
                <h2 class="popup-title">Acquire <br><span style="color: var(--ink-medium);">Fresh Coordinates.</span></h2>
                
                <p style="font-size: 1rem; margin-bottom: 30px; line-height: 1.5;">
                    Join the inner circle for weekly archive transmissions, free asset drops, and system updates.
                </p>
                
                <form action="https://formspree.io/f/mlgekbwb" method="POST">
                    <input type="email" name="email" required placeholder="Enter your email" class="popup-input">
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">Authorize Access</button>
                </form>
                
                <p style="margin-top: 20px; font-size: 0.75rem; opacity: 0.4; font-weight: 600;">
                    NO SPAM. ZERO FRICTION. ONE CLICK OPT-OUT.
                </p>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        const popup = document.getElementById('networkPopup');
        const closeBtn = popup.querySelector('.close-popup');

        popup.classList.add('active');

        closeBtn.onclick = () => {
            popup.classList.remove('active');
            sessionStorage.setItem('kynar_popup_seen', 'true');
        };
    }, 6000); // 6 seconds gives the user more time to absorb the main brand first
}




    const burgerBtn = document.querySelector('.nav-icon[aria-label="Menu"]');
    const overlay = document.querySelector('.nav-overlay');
    const closeBtn = document.querySelector('.close-menu');

    if (burgerBtn && overlay) {
        burgerBtn.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; 
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
