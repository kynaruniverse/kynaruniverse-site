// KYNAR Universe - Navigation & Drawer
// Handles burger-triggered side drawer while keeping main nav persistent

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.custom-burger');
    const drawer = document.querySelector('.side-drawer');
    const closeBtn = drawer ? drawer.querySelector('.drawer-close') : null;
    
    if (!burger || !drawer || !closeBtn) {
        console.warn('Drawer setup: required elements not found.');
        return;
    }
    
    // Create a dim overlay behind the drawer
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
    
    function openDrawer() {
        drawer.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.classList.add('drawer-open');
        drawer.setAttribute('aria-hidden', 'false');
        burger.setAttribute('aria-expanded', 'true');
    }
    
    function closeDrawer() {
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
    }
    
    function toggleDrawer() {
        const isOpen = drawer.classList.contains('is-open');
        if (isOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }
    
    // Open/close via burger
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer();
    });
    
    // Close via "X" button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
    });
    
    // Close via overlay click
    overlay.addEventListener('click', closeDrawer);
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });
});