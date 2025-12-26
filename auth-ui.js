/**
 * KYNAR UNIVERSE - Authentication Logic Layer
 * Architect: AetherCode
 * Description: Connects Firebase Auth state to the UI components.
 * Status: GOLD MASTER (Colors Fixed for Kynar 2026)
 */

import { 
    auth, 
    registerUser, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from './firebase-config.js';

// Configuration Constants
const ROUTES = {
    ACCOUNT: 'account.html',
    HOME: 'index.html'
};

const SELECTORS = {
    HEADER_AUTH_TRIGGER: '#auth-trigger',     
    HEADER_LOCK_ICON: '#header-lock-icon',    
    MOBILE_ACC_LINK: '#account-nav-mobile',   
    
    MODAL_LOGIN: '#auth-modal',
    MODAL_SIGNUP: '#signup-modal',
    
    FORM_LOGIN: '#auth-form',
    FORM_SIGNUP: '#signup-form',
    
    BTN_TOGGLE_TO_SIGNUP: '#auth-toggle-mode',
    BTN_TOGGLE_TO_LOGIN: '#back-to-login',
    
    BTN_SIGNOUT: '[data-action="sign-out"]' 
};


class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // 1. Listen for Auth Changes
        onAuthStateChanged(auth, (user) => this.renderHeaderState(user));

        // 2. Setup Global Event Listeners
        this.setupEventListeners();
    }

    renderHeaderState(user) {
        const lockIcon = document.querySelector(SELECTORS.HEADER_LOCK_ICON);
        const authLink = document.querySelector(SELECTORS.HEADER_AUTH_TRIGGER);
        const mobileLink = document.querySelector(SELECTORS.MOBILE_ACC_LINK);

        if (user) {
            document.body.classList.add('user-logged-in');
            
            // Header Icon: Active State
            if (lockIcon) {
                lockIcon.classList.add('text-gold'); // Use utility class
                lockIcon.style.color = 'var(--gold-neon)';
            }
            
            // Header Link: Go to Account
            if (authLink) {
                authLink.setAttribute('href', ROUTES.ACCOUNT);
                authLink.removeAttribute('data-modal-trigger');
                authLink.setAttribute('title', 'My Account');
            }

            // Mobile Drawer Link
            if (mobileLink) {
                const name = (user.displayName || 'Creator').split(' ')[0];
                mobileLink.innerHTML = `<i class="fa-solid fa-user-check"></i> Hello, ${name}`;
                mobileLink.style.color = "var(--gold-neon)";
                mobileLink.setAttribute('href', ROUTES.ACCOUNT);
            }

        } else {
            document.body.classList.remove('user-logged-in');

            // Header Icon: Reset
            if (lockIcon) {
                lockIcon.classList.remove('text-gold');
                lockIcon.style.color = '';
            }

            // Header Link: Open Login Modal
            if (authLink) {
                authLink.setAttribute('href', '#');
                authLink.setAttribute('data-modal-trigger', 'login');
                authLink.setAttribute('title', 'Sign In');
            }

            // Mobile Drawer Link
            if (mobileLink) {
                mobileLink.innerHTML = `<i class="fa-regular fa-circle-user"></i> My Account`;
                mobileLink.style.color = "";
                mobileLink.setAttribute('href', '#');
                mobileLink.setAttribute('data-modal-trigger', 'login');
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;

            // A. Open Login Modal (Delegation)
            const trigger = target.closest('[data-modal-trigger="login"]');
            if (trigger) {
                e.preventDefault();
                // Close drawer if open (for mobile)
                document.getElementById('side-drawer')?.classList.remove('is-open');
                this.openModal(SELECTORS.MODAL_LOGIN);
                return;
            }

            // B. Toggle Between Modals
            if (target.matches(SELECTORS.BTN_TOGGLE_TO_SIGNUP)) {
                this.closeModal(SELECTORS.MODAL_LOGIN);
                this.openModal(SELECTORS.MODAL_SIGNUP);
            }
            if (target.matches(SELECTORS.BTN_TOGGLE_TO_LOGIN)) {
                this.closeModal(SELECTORS.MODAL_SIGNUP);
                this.openModal(SELECTORS.MODAL_LOGIN);
            }

            // C. Close Modals
            if (target.closest('.auth-modal-close') || target.id === 'drawer-overlay') {
                // Only prevent default if it was a click on the overlay/button directly
                // We let the overlay click handler in script.js handle the heavy lifting,
                // but we trigger clean up here just in case.
                this.closeAllModals();
            }

            // D. Sign Out
            if (target.closest(SELECTORS.BTN_SIGNOUT)) {
                e.preventDefault();
                this.handleSignOut();
            }
        });

        // E. Form Submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches(SELECTORS.FORM_LOGIN)) {
                e.preventDefault();
                this.handleLogin(e.target);
            }
            if (e.target.matches(SELECTORS.FORM_SIGNUP)) {
                e.preventDefault();
                this.handleSignup(e.target);
            }
        });
    }

    async handleLogin(form) {
        const email = form.querySelector('#auth-email').value;
        const password = form.querySelector('#auth-password').value;
        
        await this.processAuthAction(form, async () => {
            await signInWithEmailAndPassword(auth, email, password);
        }, 'Login Successful!');
    }

    async handleSignup(form) {
        const name = form.querySelector('#reg-name').value;
        const email = form.querySelector('#reg-email').value;
        const password = form.querySelector('#reg-password').value;

        if (!name) throw new Error("Please enter your name.");

        await this.processAuthAction(form, async () => {
            await registerUser(email, password, name);
        }, 'Account Created! Welcome.');
    }

    async processAuthAction(form, actionFn, successMessage) {
        const btn = form.querySelector('button[type="submit"]');
        const msg = form.querySelector('.auth-message');
        const originalText = btn.textContent;

        try {
            btn.textContent = 'Processing...';
            btn.disabled = true;
            if (msg) msg.textContent = '';

            await actionFn();

            if (msg) {
                // FIXED: Use Cyber Green for success
                msg.style.color = '#00ff9d';
                msg.textContent = successMessage;
            }

            setTimeout(() => {
                this.closeAllModals();
                if (window.location.href.includes(ROUTES.ACCOUNT)) {
                    window.location.reload();
                } else {
                    window.location.href = ROUTES.ACCOUNT;
                }
            }, 1000);

        } catch (error) {
            console.error(error);
            if (msg) {
                // FIXED: Use System Red for errors
                msg.style.color = '#ff4444';
                msg.textContent = this.formatErrorMessage(error);
            }
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    async handleSignOut() {
        if (!confirm("Are you sure you want to sign out?")) return;
        
        try {
            await signOut(auth);
            document.body.classList.remove('user-logged-in');
            window.location.href = ROUTES.HOME;
        } catch (err) {
            console.error("Sign-out failed:", err);
        }
    }

    // --- UTILITIES ---

    openModal(selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        
        // Ensure other modals are closed first
        document.querySelectorAll('.auth-modal').forEach(m => m.classList.remove('is-open'));

        modal.classList.add('is-open');
        document.getElementById('drawer-overlay')?.classList.add('is-visible');
        document.body.classList.add('drawer-open');

        if (window.activateFocusTrap) {
            window.activateFocusTrap(modal, 'auth-trap', {
                onEscape: () => this.closeAllModals()
            });
        }
    }

    closeModal(selector) {
        const modal = document.querySelector(selector);
        if (modal) modal.classList.remove('is-open');
    }

    closeAllModals() {
        document.querySelectorAll('.auth-modal').forEach(m => m.classList.remove('is-open'));
        document.getElementById('drawer-overlay')?.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
        
        if (window.deactivateFocusTrap) {
            window.deactivateFocusTrap('auth-trap');
        }
    }

    formatErrorMessage(error) {
        const code = error.code || '';
        if (code.includes('invalid-credential')) return "Incorrect email or password.";
        if (code.includes('email-already-in-use')) return "This email is already registered.";
        if (code.includes('weak-password')) return "Password should be at least 6 characters.";
        return error.message.replace('Firebase:', '').trim();
    }
}

const authManager = new AuthManager();
export default authManager;
