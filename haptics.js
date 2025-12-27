/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL TACTILE ENGINE
 * ══════════════════════════════════════════════════════════════════════════
 * @description Provides premium, subtle haptic feedback for mobile interactions
 * using the Navigator Vibration API. Includes auto-binding for UI elements.
 * @module Haptics
 */

const Haptics = {
  // #region [ 1. CONFIGURATION ]

  // Global Toggle (Could be connected to user settings later)
  enabled: true,

  // #endregion

  // #region [ 2. FEEDBACK PATTERNS ]

  /**
   * 1. SUBTLE TICK
   * Used for: Scroll snaps, hover states, light touches.
   * Duration: 4ms
   */
  light: () => {
    if (Haptics.enabled && navigator.vibrate) navigator.vibrate(4);
  },

  /**
   * 2. CRISP TAP
   * Used for: Button presses, toggles, navigation clicks.
   * Duration: 10ms
   */
  medium: () => {
    if (Haptics.enabled && navigator.vibrate) navigator.vibrate(10);
  },

  /**
   * 3. IMPACT
   * Used for: Errors, deletions, heavy actions (warnings).
   * Duration: 25ms
   */
  heavy: () => {
    if (Haptics.enabled && navigator.vibrate) navigator.vibrate(25);
  },

  /**
   * 4. HEARTBEAT
   * Used for: Success states, acquisition, login completion.
   * Pattern: [10ms, pause 50ms, 20ms]
   */
  success: () => {
    if (Haptics.enabled && navigator.vibrate) navigator.vibrate([10, 50, 20]);
  },

  // #endregion

  // #region [ 3. AUTO-BINDER ]

  /**
   * Initializes the engine.
   * Detects mobile devices and binds touch listeners to interactive elements.
   */
  init() {
    // Detect mobile to avoid adding listeners on desktop unnecessarily
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // Target V6.0 UI Elements
      const interactiveElements = [
        ".dock-btn", // Main Action Buttons
        ".stream-card", // Horizontal Scroll Items
        ".feature-card", // Big Cards (if linked)
        ".scroll-link", // Header Navigation
        ".satchel-icon-btn", // Cart Trigger
        ".custom-burger", // Menu Trigger
        "button", // Generic Buttons
        "a", // Generic Links
      ];

      // Use event delegation for better performance
      document.body.addEventListener(
        "touchstart",
        (e) => {
          // Check if the touched element matches our target list
          if (e.target.closest(interactiveElements.join(","))) {
            Haptics.light();
          }
        },
        { passive: true }
      );
    }

    console.log("Tactile Engine: Online");
  },

  // #endregion
};

// #region [ 4. GLOBAL EXPOSURE ]

// Initialize on Load
document.addEventListener("DOMContentLoaded", Haptics.init);

// Expose globally
window.Haptics = Haptics;

// #endregion
