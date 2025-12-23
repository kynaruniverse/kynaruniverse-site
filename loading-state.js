const LoadingState = {
    overlay: null,
    isLoading: false,
    timeout: null,
    
    init() {
        this.overlay = document.getElementById('global-loading');
        if (!this.overlay) {
            // Check if body exists
            if (!document.body) {
                console.warn('LoadingState: document.body not ready');
                return;
            }
            
            // Create overlay if it doesn't exist
            this.overlay = document.createElement('div');
            this.overlay.id = 'global-loading';
            this.overlay.className = 'loading-overlay';
            this.overlay.setAttribute('aria-live', 'polite');
            this.overlay.setAttribute('aria-label', 'Loading');
            this.overlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(this.overlay);
        }
    },
    
    show(message = 'Loading...', maxDuration = 30000) {
        if (!this.overlay) this.init();
        if (!this.overlay) return; // Failed to initialize
        
        this.overlay.setAttribute('aria-label', message);
        this.overlay.classList.add('is-visible');
        this.isLoading = true;
        
        // Clear existing timeout
        if (this.timeout) clearTimeout(this.timeout);
        
        // Auto-hide after maxDuration (safety net)
        this.timeout = setTimeout(() => {
            console.warn('LoadingState: Auto-hiding after timeout');
            this.hide();
        }, maxDuration);
    },
    
    hide() {
        if (!this.overlay) return;
        
        // Clear timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        
        this.overlay.classList.remove('is-visible');
        this.isLoading = false;
    },
    
    // Button-specific loading
    buttonStart(button) {
        if (!button || button.classList.contains('btn-loading')) return; // Prevent double triggers
        
        // Store original state
        button.dataset.wasDisabled = button.disabled;
        button.dataset.originalText = button.innerHTML;
        
        button.disabled = true;
        button.classList.add('btn-loading');
        button.setAttribute('aria-busy', 'true');
    },

    buttonEnd(button, newText = null) {
        if (!button) return;
        
        // Restore original disabled state
        const wasDisabled = button.dataset.wasDisabled === 'true';
        button.disabled = wasDisabled;
        
        button.classList.remove('btn-loading');
        button.removeAttribute('aria-busy');
        
        if (newText) {
            button.innerHTML = newText;
        } else if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
        
        // Clean up data attributes
        delete button.dataset.originalText;
        delete button.dataset.wasDisabled;
    }
};

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LoadingState.init());
} else {
    LoadingState.init();
}

// Export globally
window.LoadingState = LoadingState;
