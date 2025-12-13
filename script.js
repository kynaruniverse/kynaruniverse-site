/**
 * script.js
 * Handles the mobile menu toggle functionality.
 */

// 1. Get the necessary elements from the HTML
// The .menu-icon class is now on the .custom-burger div
const menuIcon = document.querySelector('.menu-icon'); 
const mainNav = document.querySelector('.main-nav');   // The navigation bar

// 2. Define the function that runs on click
function toggleMobileMenu() {
    // Toggles the CSS class 'active-menu' on the navigation bar.
    mainNav.classList.toggle('active-menu');
}

// 3. Attach the function to the click event of the menu icon
menuIcon.addEventListener('click', toggleMobileMenu);
