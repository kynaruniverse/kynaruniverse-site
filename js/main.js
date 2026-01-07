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
    initCheckoutFormatting(); // NEW: Smart inputs for checkout
    highlightCurrentPage();
});

/* ---------------------------------------------------------
   1. GLOBAL MOBILE MENU
   --------------------------------------------------------- */
function initMobileMenu() {
    const allToggles = document.querySelectorAll('.menu-toggle');
    const menuToggles = Array.from(allToggles).filter(btn => btn.id !== 'theme-toggle');
    
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    
    if (!menuToggles.length || !mobileMenu) return;

    const toggleMenu = (forceClose = false) => {
        const isClosed = !mobileMenu.classList.contains('is-active');
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

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) toggleMenu(true);
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });
}

/* ---------------------------------------------------------
   2. THEME TOGGLE
   --------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
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
   3. CHECKOUT FORMATTING (NEW)
   --------------------------------------------------------- */
function initCheckoutFormatting() {
    const cardInput = document.getElementById('card');
    const expiryInput = document.getElementById('expiry');
    const cvcInput = document.getElementById('cvc');

    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            value = value.substring(0, 16); // Limit to 16 digits
            // Add space every 4 digits
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4); // Limit MMYY
            if (value.length >= 3) {
                value = value.substring(0, 2) + ' / ' + value.substring(2);
            }
            e.target.value = value;
        });
    }

    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

/* ---------------------------------------------------------
   4. CODE COPY
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
        } catch (err) { console.error('Copy failed', err); }
    });
}

/* ---------------------------------------------------------
   5. FORM VALIDATION
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
            // Note: We don't preventDefault if action is set (like checkout)
            // unless validation fails.
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
   6. FILTER CHIPS
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
   7. ACTIVE LINK HIGHLIGHTER
   --------------------------------------------------------- */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.mobile-nav-link, .dept-card, .dash-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename) {
            link.style.fontWeight = 'bold';
            if (link.classList.contains('mobile-nav-link')) {
                link.style.borderLeft = '4px solid currentColor';
                link.style.paddingLeft = '12px';
            }
            if (link.classList.contains('dash-link')) {
                link.classList.add('is-active');
            }
        }
    });
}
