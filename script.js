/**
 * KYNAR Universe Website - Main JavaScript
 * Handles mobile menu toggle functionality and global UX
 */

// Use an Immediately Invoked Function Expression (IIFE) for encapsulation
(function() {
    'use strict';

    // Constants for DOM elements and selectors
    const menuIcon = document.querySelector('.custom-burger'); // Using the more specific class
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Constant for the mobile breakpoint (must match CSS @media query: 768px)
    const MOBILE_BREAKPOINT = 768;
    
    // CSS classes used for toggling
    const ACTIVE_CLASS = 'active-menu'; // Toggles visibility on the navigation
    const ICON_CLASS = 'is-active';     // Toggles burger animation (renamed from 'active' for clarity)

    /**
     * Toggles the mobile menu state (open/close).
     * @param {boolean} [forceState] - Optional boolean to explicitly set the menu state.
     */
    function toggleMenu(forceState) {
        // Determine the new state: toggle current state, or use the forced state
        const isOpen = forceState !== undefined ? forceState : !mainNav.classList.contains(ACTIVE_CLASS);

        mainNav.classList.toggle(ACTIVE_CLASS, isOpen);
        menuIcon.classList.toggle(ICON_CLASS, isOpen);

        // Crucial for Accessibility (A11y): Update ARIA attribute
        menuIcon.setAttribute('aria-expanded', isOpen);
        
        // Optional: Manage body scroll lock if needed (e.g., body.classList.toggle('no-scroll', isOpen);)
    }

    /**
     * Initializes the mobile menu handler.
     */
    function initializeMenuHandler() {
        if (!menuIcon || !mainNav) {
            console.error('Menu elements not found. Check selectors.');
            return;
        }
        
        // 1. Core Toggle Logic
        menuIcon.addEventListener('click', () => {
            toggleMenu();
        });

        // 2. Close menu when clicking a link (improves mobile UX)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Ensure the menu is only closed if it is actually visible/open
                if (mainNav.classList.contains(ACTIVE_CLASS)) {
                    toggleMenu(false); // Explicitly close
                }
            });
        });

        // 3. Close menu when clicking outside (on mobile only)
        document.addEventListener('click', (event) => {
            // Check if the click is outside both the nav and the menu button
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnMenu = menuIcon.contains(event.target);
            
            // Check if the menu is open AND the device is in the mobile range
            if (!isClickInsideNav && !isClickOnMenu && mainNav.classList.contains(ACTIVE_CLASS) && window.innerWidth < MOBILE_BREAKPOINT) {
                toggleMenu(false); // Explicitly close
            }
        });
        
        // 4. Desktop Cleanup using matchMedia (More performant than general 'resize')
        // Checks for devices wider than the mobile breakpoint
        const desktopQuery = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);

        function handleDesktopChange(e) {
            if (e.matches) {
                // If it's a desktop size, ensure the mobile-specific classes are removed
                if (mainNav.classList.contains(ACTIVE_CLASS)) {
                     toggleMenu(false); 
                }
            }
        }
        
        // Run once on load
        handleDesktopChange(desktopQuery); 
        // Listen for changes
        desktopQuery.addListener(handleDesktopChange);

    } // End initializeMenuHandler
    
    // Wait for the DOM to be ready before running setup functions
    document.addEventListener('DOMContentLoaded', initializeMenuHandler);
    
    console.log('KYNAR Universe website scripts initialized.');
})();


/**
 * Optional: Smooth scroll for anchor links
 * Uncomment if you add anchor navigation later
 */
/*
// (function() {
//    // ... smooth scroll logic here ...
// })();
*/
