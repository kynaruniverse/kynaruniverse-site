/**
 * KYNAR Universe Website - Main JavaScript
 * Handles mobile menu toggle functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Get the hamburger menu icon and navigation elements
  const menuIcon = document.querySelector('.menu-icon');
  const mainNav = document.querySelector('.main-nav');
  
  // Check if elements exist before adding event listener
  if (menuIcon && mainNav) {
    // Toggle mobile menu on click
    menuIcon.addEventListener('click', function() {
      mainNav.classList.toggle('active-menu');
      
      // Optional: Add animation to hamburger icon
      this.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link (optional, for better UX)
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Only close on mobile (when menu is toggled)
        if (window.innerWidth < 768) {
          mainNav.classList.remove('active-menu');
          menuIcon.classList.remove('active');
        }
      });
    });
  }
  
  // Handle window resize to ensure menu is visible on desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      // Remove active class if resizing to desktop view
      mainNav.classList.remove('active-menu');
      menuIcon.classList.remove('active');
    }
  });
  
  // Optional: Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = mainNav.contains(event.target);
    const isClickOnMenu = menuIcon.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnMenu && window.innerWidth < 768) {
      mainNav.classList.remove('active-menu');
      menuIcon.classList.remove('active');
    }
  });
  
  // Console message for debugging
  console.log('KYNAR Universe website loaded successfully!');
});

/**
 * Optional: Smooth scroll for anchor links
 * Uncomment if you add anchor navigation later
 */
/*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
*/