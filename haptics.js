/**
 * SOFT ROYAL TACTILE ENGINE
 * Role: Provide premium, subtle haptic feedback for mobile interactions.
 */

const Haptics = {
    
    // Global Toggle (Could be connected to user settings later)
    enabled: true,

    // 1. SUBTLE TICK (Scroll snaps, hover, light touch)
    light: () => {
        if (Haptics.enabled && navigator.vibrate) navigator.vibrate(4); 
    },
    
    // 2. CRISP TAP (Button presses, toggles, navigation)
    medium: () => {
        if (Haptics.enabled && navigator.vibrate) navigator.vibrate(10);
    },
    
    // 3. IMPACT (Errors, Deletions, Heavy Actions)
    heavy: () => {
        if (Haptics.enabled && navigator.vibrate) navigator.vibrate(25);
    },

    // 4. HEARTBEAT (Success, Acquisition, Login)
    success: () => {
        if (Haptics.enabled && navigator.vibrate) navigator.vibrate([10, 50, 20]);
    },

    // --- AUTO-BINDER ---
    init() {
        // Detect mobile to avoid adding listeners on desktop unnecessarily
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isMobile) {
            // Target V6.0 UI Elements
            const interactiveElements = [
                '.dock-btn',         // Main Action Buttons
                '.stream-card',      // Horizontal Scroll Items
                '.feature-card',     // Big Cards (if linked)
                '.scroll-link',      // Header Navigation
                '.satchel-icon-btn', // Cart Trigger
                '.custom-burger',    // Menu Trigger
                'button',            // Generic Buttons
                'a'                  // Generic Links
            ];

            // Use event delegation for better performance
            document.body.addEventListener('touchstart', (e) => {
                // Check if the touched element matches our target list
                if (e.target.closest(interactiveElements.join(','))) {
                    Haptics.light();
                }
            }, { passive: true });
        }
        
        console.log("Tactile Engine: Online");
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', Haptics.init);

// Expose globally
window.Haptics = Haptics;
