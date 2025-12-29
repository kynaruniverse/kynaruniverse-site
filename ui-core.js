/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V3.0)
   Mobile-First Intelligence & Physics
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initSmartHeader();
    initCustomCursor();
    initRevealAnimations();
    console.log("Kynar Atelier: Online");
});

// 1. LUXURIOUS SMOOTH SCROLL (Lenis)
function initSmoothScroll() {
    // We check if Lenis is loaded first
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
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
    let lastScroll = 0;
    const threshold = 50; // Minimum scroll before action

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // At the very top? Always show.
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }

        // Scrolling Down? Hide.
        if (currentScroll > lastScroll && currentScroll > threshold) {
            header.classList.add('hidden');
        } 
        // Scrolling Up? Show.
        else if (currentScroll < lastScroll) {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

// 3. MAGNETIC CURSOR (Desktop Only)
function initCustomCursor() {
    // Only run if device has a fine pointer (mouse)
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

            // Dot follows instantly
            dot.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
            
            // Outline follows with lag (creates the "liquid" feel)
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
