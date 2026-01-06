/* js/main.js */

/**
 * DIGITAL MARKETPLACE - MAIN LOGIC
 * Architecture: Vanilla JS, Event Delegation, DOMContentLoaded
 * Budget: < 5KB
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initThemeToggle();
    initCodeCopy();
    initFormValidation();
    initFilterChips();
    highlightCurrentPage(); // NEW: Visual indicator for active page
});

/* ---------------------------------------------------------
   1. GLOBAL MOBILE MENU
   --------------------------------------------------------- */
function initMobileMenu() {
    // Exclude the theme toggle from menu triggers
    const allToggles = document.querySelectorAll('.menu-toggle');
    const menuToggles = Array.from(allToggles).filter(btn => btn.id !== 'theme-toggle');
    
    const mobileMenu = document.getElementById('mobile-menu');
    // Select links inside to close menu on click
    const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    
    if (!menuToggles.length || !mobileMenu) return;

    const toggleMenu = (forceClose = false) => {
        const isClosed = !mobileMenu.classList.contains('is-active');
        
        // If we want to force close and it's already closed, do nothing
        if (forceClose && isClosed) return;

        if (forceClose) {
            mobileMenu.classList.remove('is-active');
            document.body.style.overflow = '';
            menuToggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        } else {
            mobileMenu.classList.toggle('is-active');
            const newState = mobileMenu.classList.contains('is-active');
            document.body.style.overflow = newState ? 'hidden' : '';
            menuToggles.forEach(btn => btn.setAttribute('aria-expanded', newState));
        }
    };

    menuToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    });

    // Close when clicking outside content
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu(true);
        }
    });

    // Close when clicking a link inside
    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });
}

/* ---------------------------------------------------------
   2. THEME TOGGLE (Light/Dark Mode)
   --------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme'); 
    }

    if (!themeBtn) return;

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ---------------------------------------------------------
   3. CODE SNIPPET COPY
   --------------------------------------------------------- */
function initCodeCopy() {
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.code-preview__copy');
        if (!copyBtn) return;

        const container = copyBtn.closest('.code-preview');
        const codeBlock = container.querySelector('code');
        if (!codeBlock) return;

        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            const originalText = copyBtn.innerHTML;
            
            // Visual Feedback
            copyBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
            `;
            copyBtn.style.color = 'var(--color-success)';
            copyBtn.style.borderColor = 'var(--color-success)';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyBtn.textContent = 'Error';
        }
    });
}

/* ---------------------------------------------------------
   4. FORM VALIDATION
   --------------------------------------------------------- */
function initFormValidation() {
    const inputs = document.querySelectorAll('.input');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('input--error')) {
                input.classList.remove('input--error');
                removeErrorMsg(input);
            }
        });
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const formInputs = form.querySelectorAll('.input[required]');
            formInputs.forEach(input => {
                if (!validateInput(input)) isValid = false;
            });
            if (!isValid) e.preventDefault();
        });
    });
}

function validateInput(input) {
    if (!input.checkValidity()) {
        input.classList.add('input--error');
        showErrorMsg(input);
        return false;
    } else {
        input.classList.remove('input--error');
        removeErrorMsg(input);
        return true;
    }
}

function showErrorMsg(input) {
    const existingMsg = input.parentNode.querySelector('.input-error-msg');
    if (existingMsg) return;
    const msg = document.createElement('span');
    msg.className = 'input-error-msg';
    msg.textContent = input.validationMessage;
    input.parentNode.appendChild(msg);
}

function removeErrorMsg(input) {
    const msg = input.parentNode.querySelector('.input-error-msg');
    if (msg) msg.remove();
}

/* ---------------------------------------------------------
   5. FILTER CHIPS
   --------------------------------------------------------- */
function initFilterChips() {
    const chipContainer = document.querySelector('.filter-bar');
    if (!chipContainer) return;

    chipContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        const siblings = chipContainer.querySelectorAll('.chip');
        siblings.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
    });
}

/* ---------------------------------------------------------
   6. ACTIVE LINK HIGHLIGHTER (NEW)
   --------------------------------------------------------- */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    // Select both mobile links and desktop department cards
    const links = document.querySelectorAll('.mobile-nav-link, .dept-card');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename) {
            // Add a visual indicator
            link.style.fontWeight = 'bold';
            // If it's a mobile link, add a left border
            if (link.classList.contains('mobile-nav-link')) {
                link.style.borderLeft = '4px solid currentColor';
                link.style.paddingLeft = '12px';
            }
        }
    });
}
