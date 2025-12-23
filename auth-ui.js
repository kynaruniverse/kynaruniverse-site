/**
 * KYNAR UNIVERSE - Authentication UI Module
 * Handles: Login, Signup, Header State
 */
import { auth, registerUser, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

const AuthUI = (() => {

    // --- 1. CONFIGURATION ---
    const CONFIG = {
        redirectDelay: 1500,
        paths: {
            account: 'account.html',
            home: 'index.html'
        }
    };

    // --- 2. INTERNAL UTILITIES ---
    const triggerModalClose = () => {
        // Uses the global Close logic from script.js / utilities.js
        const activeCloseBtn = document.querySelector('.auth-modal.is-open .auth-modal-close');
        if (activeCloseBtn) activeCloseBtn.click();
    };

    // --- 3. UI UPDATERS ---
    const updateHeaderState = (user) => {
        const signInText = document.querySelector('.sign-in-text');
        const lockIconContainer = document.querySelector('.custom-lock-icon');
        
        // Mobile drawer link
        const mobileAccountLink = document.getElementById('account-nav-mobile');

        if (user) {
            // LOGGED IN
            const initial = (user.displayName || 'U').charAt(0).toUpperCase();
            const firstName = (user.displayName || 'Account').split(' ')[0];

            if (signInText) signInText.textContent = firstName;
            
            if (lockIconContainer) {
                lockIconContainer.innerHTML = `<span class="user-initial">${initial}</span>`;
                lockIconContainer.classList.add('active-user');
                lockIconContainer.parentElement.setAttribute('href', CONFIG.paths.account); // Link goes to account
            }
            
            // Update Mobile Link
            if (mobileAccountLink) {
                 mobileAccountLink.innerHTML = `<i class="fa-solid fa-user-check"></i> Hello, ${firstName}`;
                 mobileAccountLink.style.color = "var(--color-main-gold)";
            }

            document.body.classList.add('user-logged-in');
        } else {
            // LOGGED OUT
            if (signInText) signInText.textContent = 'Sign in';
            
            if (lockIconContainer) {
                lockIconContainer.innerHTML = `<img src="images/log-in-icon.png" alt="" width="60" height="60">`;
                lockIconContainer.classList.remove('active-user');
                lockIconContainer.parentElement.setAttribute('href', '#'); // Link opens modal
            }

            if (mobileAccountLink) {
                mobileAccountLink.innerHTML = `<i class="fa-regular fa-circle-user"></i> My Account`;
                mobileAccountLink.style.color = "";
            }
            
            document.body.classList.remove('user-logged-in');
        }
    };

    // --- 4. FORM HANDLERS ---
    const handleAuthSubmit = async (form, actionType) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        const msgContainer = form.querySelector('.auth-message');
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const nameInput = form.querySelector('input[type="text"]'); // For signup only

        // Loading State
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        if (msgContainer) msgContainer.textContent = '';

        try {
            if (actionType === 'signup') {
                if (!nameInput.value) throw new Error("Display name is required");
                // Use our custom register function
                await registerUser(email, password, nameInput.value);
            } else {
                // Standard Login
                await signInWithEmailAndPassword(auth, email, password);
            }

            // Success feedback
            if (msgContainer) {
                msgContainer.style.color = 'var(--color-search-deep)';
                msgContainer.textContent = "Success! Redirecting...";
            }

            setTimeout(() => {
                if (window.location.href.includes(CONFIG.paths.account)) {
                    window.location.reload(); 
                } else {
                    triggerModalClose();
                }
            }, 1000);

        } catch (error) {
            console.error(error);
            if (msgContainer) {
                msgContainer.style.color = 'var(--color-star-red)';
                const cleanMsg = error.message.replace('Firebase:', '').replace('auth/', '').replace(/-/g, ' ');
                msgContainer.textContent = cleanMsg;
            }
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    };

    const setupLogout = () => {
        const signOutBtns = document.querySelectorAll('#sign-out-btn');
        signOutBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                await signOut(auth);
                window.location.href = CONFIG.paths.home;
            });
        });
    };

    // --- 5. INIT ---
    const init = () => {
        // 1. Listen for Auth State (No waiting required now!)
        onAuthStateChanged(auth, (user) => {
            updateHeaderState(user);
        });

        // 2. Attach Form Listeners
        const loginForm = document.getElementById('auth-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAuthSubmit(loginForm, 'login');
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAuthSubmit(signupForm, 'signup');
            });
        }

        setupLogout();
        console.log('✨ Auth UI Loaded via Modules');
    };

    return { init };
})();

AuthUI.init();
