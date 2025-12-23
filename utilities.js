class FocusTrap {
    constructor(element, options = {}) {
        this.element = element;
        this.focusableElements = null;
        this.firstFocusable = null;
        this.lastFocusable = null;
        this.previousActiveElement = null;
        this.isActive = false;
        this.onEscape = options.onEscape || null;
    }

    activate() {
        if (this.isActive) return;
        this.isActive = true;

        this.previousActiveElement = document.activeElement;
        this.updateFocusableElements();

        if (this.focusableElements.length === 0) {
            console.warn('FocusTrap: No focusable elements found in', this.element);
            this.isActive = false;
            return;
        }

        if (this.firstFocusable) {
            this.firstFocusable.focus();
        }

        this.element.addEventListener('keydown', this.handleKeydown);
    }
    
    refresh() {
        this.updateFocusableElements();
    }

    deactivate() {
        if (!this.isActive) return;
        this.isActive = false;

        this.element.removeEventListener('keydown', this.handleKeydown);

        if (this.previousActiveElement && this.previousActiveElement.focus) {
            this.previousActiveElement.focus();
        }
    }

    updateFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'audio[controls]',
            'video[controls]',
            '[contenteditable]:not([contenteditable="false"])'
        ];

        this.focusableElements = Array.from( 
            this.element.querySelectorAll(focusableSelectors.join(','))
        ).filter(el => { 
            const style = window.getComputedStyle(el);
            const isVisible = style.display !== 'none' 
                && style.visibility !== 'hidden' 
                && (el.offsetParent !== null || style.position === 'fixed')
                && style.opacity !== '0';
            
            return isVisible && this.element.contains(el);
        });

        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    }

    handleKeydown = (e) => {
        // Handle Escape key if callback provided
        if (e.key === 'Escape' && this.onEscape) {
            this.onEscape(e);
            return;
        }

        // Only handle Tab key for focus trap
        if (e.key !== 'Tab') return;

        // If no focusable elements, do nothing
        if (this.focusableElements.length === 0) return;

        // If only one focusable element, prevent tabbing
        if (this.focusableElements.length === 1) {
            e.preventDefault();
            return;
        }

        // Shift + Tab (going backwards)
        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } 
        // Tab (going forwards)
        else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }
}

// Global focus trap instances
const focusTraps = new Map();

// Helper functions to integrate with existing modals
function activateFocusTrap(modalElement, trapId = 'default', options = {}) {
    if (!modalElement) {
        console.warn('activateFocusTrap: No element provided');
        return;
    }

    // Deactivate existing trap with same ID
    deactivateFocusTrap(trapId);

    const trap = new FocusTrap(modalElement, options);
    trap.activate();
    focusTraps.set(trapId, trap);
    
    return trap; // Return trap instance for direct access if needed
}

function deactivateFocusTrap(trapId = 'default') {
    const trap = focusTraps.get(trapId);
    if (trap) {
        trap.deactivate();
        focusTraps.delete(trapId);
    }
}

function refreshFocusTrap(trapId = 'default') {
    const trap = focusTraps.get(trapId);
    if (trap) {
        trap.refresh();
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FocusTrap = FocusTrap;
    window.activateFocusTrap = activateFocusTrap;
    window.deactivateFocusTrap = deactivateFocusTrap;
    window.refreshFocusTrap = refreshFocusTrap;
}
