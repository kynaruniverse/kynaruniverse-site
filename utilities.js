/**
 * KYNAR UNIVERSE - Interaction & Component Engine
 * Architect: AetherCode
 * Evolution: Elastic Stack (Platinum Plus)
 */

/* --- 1. THE ELASTIC INTERACTION ENGINE --- */

const ElasticEngine = {
    init() {
        this.bindCardShuffling();
        this.setupPullToSearch();
        console.log('✨ Elastic Interaction Engine Online');
    },
    
    /**
     * Accordion Expansion: Handles the vertical stack expansion.
     * Tapping a card header "unstacks" the card into full view.
     */
    bindCardShuffling() {
        document.body.addEventListener('click', (e) => {
            const header = e.target.closest('.stack-card-header');
            if (header) {
                const card = header.parentElement;
                const isExpanded = card.classList.contains('is-expanded');
                
                // Close all cards to maintain the 'wallet' stack hierarchy
                document.querySelectorAll('.stack-card').forEach(c => {
                    c.classList.remove('is-expanded');
                });
                
                // Expand target and use haptic scroll-alignment
                if (!isExpanded) {
                    card.classList.add('is-expanded');
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    },
    
    /**
     * Elastic Pull-to-Search: 
     * Simulates mobile OS 'pull down' gesture to reveal the hidden search layer.
     */
    setupPullToSearch() {
        let startY = 0;
        const searchOverlay = document.getElementById('elastic-search-overlay');
        
        window.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) startY = e.touches[0].pageY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            const moveY = e.touches[0].pageY;
            // Trigger overlay if user pulls down significantly at the top of the page
            if (window.scrollY === 0 && moveY > startY + 120) {
                searchOverlay?.classList.add('is-visible');
                document.body.classList.add('drawer-open');
            }
        }, { passive: true });
    }
};

/* --- 2. ACCESSIBILITY: FOCUS TRAP (RETAINED & OPTIMIZED) --- */

class FocusTrap {
    constructor(element, options = {}) {
        this.element = element;
        this.focusableElements = [];
        this.isActive = false;
        this.onEscape = options.onEscape || null;
    }
    
    activate() {
        if (this.isActive) return;
        this.isActive = true;
        this.previousActiveElement = document.activeElement;
        this.updateFocusableElements();
        
        if (this.focusableElements.length > 0) {
            this.focusableElements[0].focus();
        }
        
        this.element.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('focusin', this.handleFocusIn, true);
    }
    
    deactivate() {
        if (!this.isActive) return;
        this.isActive = false;
        this.element.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('focusin', this.handleFocusIn, true);
        if (this.previousActiveElement?.focus) this.previousActiveElement.focus();
    }
    
    updateFocusableElements() {
        const selectors = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', '[tabindex]:not([tabindex="-1"])'];
        this.focusableElements = Array.from(this.element.querySelectorAll(selectors.join(',')))
            .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
    }
    
    handleFocusIn = (e) => {
        if (this.isActive && !this.element.contains(e.target)) {
            this.focusableElements[0].focus();
        }
    }
    
    handleKeydown = (e) => {
        if (e.key === 'Escape' && this.onEscape) this.onEscape(e);
        if (e.key !== 'Tab') return;
        
        const first = this.focusableElements[0];
        const last = this.focusableElements[this.focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

// Global Trap Manager
const focusTraps = new Map();
window.activateFocusTrap = (el, id = 'default', opt = {}) => {
    const trap = new FocusTrap(el, opt);
    trap.activate();
    focusTraps.set(id, trap);
};
window.deactivateFocusTrap = (id = 'default') => {
    const trap = focusTraps.get(id);
    if (trap) { trap.deactivate();
        focusTraps.delete(id); }
};

/* --- 3. COMPONENT LOADER (ENGINE) --- */

async function loadComponents() {
    const includes = document.querySelectorAll('[data-include]');
    const loadPromises = Array.from(includes).map(async (el) => {
        const file = el.dataset.include;
        try {
            const resp = await fetch(file);
            if (resp.ok) {
                const content = await resp.text();
                el.outerHTML = content; // Direct replacement for cleaner DOM
            }
        } catch (err) { console.error(`[Loader] Error loading ${file}:`, err); }
    });
    
    await Promise.all(loadPromises);
    document.dispatchEvent(new Event('componentsLoaded'));
    ElasticEngine.init(); // Initialize physics after components exist
}

document.addEventListener('DOMContentLoaded', loadComponents);
