/**
 * KYNAR UNIVERSE - Haptic Loading Engine
 * Architect: AetherCode
 * Evolution: Platinum Plus Elastic Edition
 */

const LoadingState = {
    overlay: null,
    isLoading: false,
    timeout: null,
    
    init() {
        this.overlay = document.getElementById('global-loading');
        
        if (!this.overlay && document.body) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'global-loading';
            this.overlay.className = 'loading-overlay';
            this.overlay.style.cssText = `
                display: none !important;
                position: fixed; inset: 0;
                background: rgba(255,255,255,0.8);
                backdrop-filter: blur(10px);
                z-index: 99999;
                align-items: center; justify-content: center;
            `;
            this.overlay.innerHTML = '<div class="loading-spinner" style="width:40px; height:40px; border:3px solid var(--bg-surface); border-top-color:var(--gold-neon); border-radius:50%; animation: spin 1s infinite linear;"></div>';
            document.body.appendChild(this.overlay);
        }
    },
    
    show(message = 'SYNCHRONIZING...', maxDuration = 10000) {
        if (!this.overlay) this.init();
        this.overlay.style.display = 'flex';
        this.overlay.classList.add('is-visible');
        this.isLoading = true;
        
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.hide(), maxDuration);
    },

    hide() {
        if (!this.overlay) return;
        this.overlay.style.display = 'none';
        this.overlay.classList.remove('is-visible');
        this.isLoading = false;
    },

    /**
     * Platinum Button Physics:
     * Adds a "Cyber Green" success state and haptic text swap.
     */
    buttonStart(button) {
        if (!button || button.disabled) return;
        
        button.dataset.originalHtml = button.innerHTML;
        button.dataset.originalBg = button.style.background;
        button.disabled = true;
        
        // Haptic "Press" effect
        button.style.transform = 'scale(0.95)';
        button.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
    },

    buttonEnd(button, successText = "ACQUIRED") {
        if (!button) return;
        
        // Transition to "Cyber Green" Success State
        button.style.background = '#00ff9d';
        button.style.color = '#000';
        button.style.transform = 'scale(1.02)'; // Slight "pop" on success
        button.innerHTML = `<i class="fa-solid fa-check" style="margin-right:8px;"></i> ${successText}`;
        
        // Reset Protocol
        setTimeout(() => {
            button.style.transform = '';
            button.style.background = button.dataset.originalBg || '';
            button.style.color = '';
            button.innerHTML = button.dataset.originalHtml;
            button.disabled = false;
        }, 2500);
    }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => LoadingState.init());
window.LoadingState = LoadingState;
