/**
 * KYNAR UNIVERSE - Identity & Auth Logic
 * Architect: AetherCode
 * Evolution: Platinum Plus Elastic Edition
 */

import { 
    auth, 
    registerUser, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from './firebase-config.js';

const ROUTES = { ACCOUNT: 'account.html', HOME: 'index.html' };

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // 1. Synchronize Header & Mobile UI with Auth State
        onAuthStateChanged(auth, (user) => this.renderIdentityState(user));

        // 2. Global Event Delegation
        this.setupEventListeners();
    }

    renderIdentityState(user) {
        const lockIcon = document.querySelector('#header-lock-icon');
        const authTrigger = document.querySelector('#auth-trigger');

        if (user) {
            document.body.classList.add('user-logged-in');
            if (lockIcon) lockIcon.style.color = 'var(--gold-neon)';
            if (authTrigger) {
                authTrigger.setAttribute('href', ROUTES.ACCOUNT);
                authTrigger.title = "Access Command Center";
            }
        } else {
            document.body.classList.remove('user-logged-in');
            if (lockIcon) lockIcon.style.color = '';
            if (authTrigger) {
                authTrigger.setAttribute('href', '#');
                authTrigger.title = "Identify";
            }
        }
    }

    setupEventListeners() {
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // A. Open Modal (If Logged Out)
            if (target.closest('#auth-trigger') && !document.body.classList.contains('user-logged-in')) {
                e.preventDefault();
                this.openIdentityPanel();
            }

            // B. Toggle Views (Login / Signup)
            if (target.id === 'show-signup-btn') this.switchView('signup');
            if (target.id === 'back-to-login-btn') this.switchView('login');

            // C. Close Panel
            if (target.closest('.drawer-close') || target.classList.contains('auth-modal-backdrop')) {
                this.closeIdentityPanel();
            }

            // D. Sign Out (Command Center)
            if (target.id === 'account-sign-out') {
                e.preventDefault();
                this.handleSignOut();
            }
        });

        // E. Form Submissions
        document.body.addEventListener('submit', (e) => {
            if (e.target.id === 'auth-form') {
                e.preventDefault();
                this.handleLogin(e.target);
            }
            if (e.target.id === 'signup-form') {
                e.preventDefault();
                this.handleSignup(e.target);
            }
        });
    }

    switchView(view) {
        const loginView = document.getElementById('auth-login-view');
        const signupView = document.getElementById('auth-signup-view');
        
        if (view === 'signup') {
            loginView.style.display = 'none';
            signupView.style.display = 'block';
        } else {
            loginView.style.display = 'block';
            signupView.style.display = 'none';
        }
    }

    async handleLogin(form) {
        const email = form.querySelector('#auth-email').value;
        const password = form.querySelector('#auth-password').value;
        const btn = form.querySelector('button[type="submit"]');

        if (window.LoadingState) window.LoadingState.buttonStart(btn);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            this.handleSuccess(btn, "AUTHORIZED");
        } catch (error) {
            this.handleError(form, error, btn);
        }
    }

    async handleSignup(form) {
        const name = form.querySelector('#reg-name').value;
        const email = form.querySelector('#reg-email').value;
        const password = form.querySelector('#reg-password').value;
        const btn = form.querySelector('button[type="submit"]');

        if (window.LoadingState) window.LoadingState.buttonStart(btn);

        try {
            await registerUser(email, password, name);
            this.handleSuccess(btn, "INITIALIZED");
        } catch (error) {
            this.handleError(form, error, btn);
        }
    }

    handleSuccess(btn, msg) {
        if (window.LoadingState) window.LoadingState.buttonEnd(btn, msg);
        setTimeout(() => {
            this.closeIdentityPanel();
            window.location.href = ROUTES.ACCOUNT;
        }, 1500);
    }

    handleError(form, error, btn) {
        const msgEl = form.querySelector('.auth-message');
        if (msgEl) {
            msgEl.style.color = '#ff4444';
            msgEl.textContent = error.message.replace('Firebase:', '').trim();
        }
        btn.disabled = false;
        btn.textContent = "RETRY";
    }

    openIdentityPanel() {
        const modal = document.getElementById('auth-modal');
        const overlay = document.querySelector('.drawer-overlay');
        
        modal?.classList.add('is-open');
        overlay?.classList.add('is-visible');
        document.body.classList.add('drawer-open');
    }

    closeIdentityPanel() {
        const modal = document.getElementById('auth-modal');
        const overlay = document.querySelector('.drawer-overlay');
        
        modal?.classList.remove('is-open');
        overlay?.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
    }

    async handleSignOut() {
        if (!confirm("TERMINATE SESSION?")) return;
        await signOut(auth);
        window.location.href = ROUTES.HOME;
    }
}

const authManager = new AuthManager();
export default authManager;
