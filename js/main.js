/* js/main.js */

/**
 * DIGITAL MARKETPLACE - MAIN LOGIC
 * Architecture: Vanilla JS, Event Delegation, DOMContentLoaded
 * Budget: < 5KB
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCodeCopy();
    initFormValidation();
    initFilterChips();
});

/* ---------------------------------------------------------
   1. GLOBAL MOBILE MENU
   Handles opening/closing the slide-in navigation
   --------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelectorAll('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuToggle.length || !mobileMenu) return;

    // Open/Close Logic
    const toggleMenu = () => {
        const isClosed = !mobileMenu.classList.contains('is-active');
        
        // Toggle State
        mobileMenu.classList.toggle('is-active');
        document.body.style.overflow = isClosed ? 'hidden' : ''; // Prevent body scroll
        
        // Update ARIA for accessibility
        menuToggle.forEach(btn => {
            btn.setAttribute('aria-expanded', isClosed);
        });
    };

    // Attach listeners to all toggle buttons (hamburger and close X)
    menuToggle.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    });

    // Close when clicking outside content (optional polish)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu();
        }
    });
}

/* ---------------------------------------------------------
   2. CODE SNIPPET COPY
   Uses Clipboard API to copy text from <pre> blocks
   --------------------------------------------------------- */
function initCodeCopy() {
    // We use event delegation on the body to catch all copy buttons
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.code-preview__copy');
        if (!copyBtn) return;

        // Find the associated code block
        // Assuming structure: Header > Button, Sibling > Content
        const container = copyBtn.closest('.code-preview');
        const codeBlock = container.querySelector('code');
        
        if (!codeBlock) return;

        try {
            // Write text to clipboard
            await navigator.clipboard.writeText(codeBlock.textContent);
            
            // Visual Feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
            `;
            copyBtn.style.color = 'var(--color-success)';
            copyBtn.style.borderColor = 'var(--color-success)';

            // Reset after 2 seconds
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
   3. FORM VALIDATION
   Applies our .input--error classes based on native validity
   --------------------------------------------------------- */
function initFormValidation() {
    const inputs = document.querySelectorAll('.input');

    inputs.forEach(input => {
        // Validate on blur (when user leaves field)
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        // Clear error as soon as user types
        input.addEventListener('input', () => {
            if (input.classList.contains('input--error')) {
                input.classList.remove('input--error');
                removeErrorMsg(input);
            }
        });
    });

    // Form Submit Interception
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const formInputs = form.querySelectorAll('.input[required]');
            
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault(); // Stop submission if errors
            }
        });
    });
}

// Helper: Apply visual error state
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

// Helper: Show error message below input
function showErrorMsg(input) {
    const existingMsg = input.parentNode.querySelector('.input-error-msg');
    if (existingMsg) return; // Don't duplicate

    const msg = document.createElement('span');
    msg.className = 'input-error-msg';
    msg.textContent = input.validationMessage; // Uses browser's native error text
    input.parentNode.appendChild(msg);
}

// Helper: Remove error message
function removeErrorMsg(input) {
    const msg = input.parentNode.querySelector('.input-error-msg');
    if (msg) {
        msg.remove();
    }
}

/* ---------------------------------------------------------
   4. FILTER CHIPS (Visual Toggle Only)
   For Phase 1 prototype, this just toggles the 'is-active' class
   --------------------------------------------------------- */
function initFilterChips() {
    const chipContainer = document.querySelector('.filter-bar');
    if (!chipContainer) return;

    chipContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;

        // Remove active class from siblings
        const siblings = chipContainer.querySelectorAll('.chip');
        siblings.forEach(c => c.classList.remove('is-active'));

        // Activate clicked chip
        chip.classList.add('is-active');
    });
}
