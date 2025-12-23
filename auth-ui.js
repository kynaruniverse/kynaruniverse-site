/* ============================================================
   KYNAR UNIVERSE - AUTH UI ENGINE (REFINED)
   Handles: Firebase Auth, Modals, Focus Traps, & Loading States
   ============================================================ */

let authRetries = 0;

function initAuthUI() {
    // 1. ASYNC INITIALIZATION CHECK
    // Ensures Firebase variables are available before running
    if (!window._firebaseAuth) {
        if (authRetries < 50) {
            authRetries++;
            setTimeout(initAuthUI, 100);
            return;
        }
        console.error("Auth Error: Firebase failed to initialize.");
        return;
    }

    const auth = window._firebaseAuth;
    const onAuthChange = window._firebaseOnAuthStateChanged;
    const signInFirebase = window._firebaseSignIn;
    const signUpFirebase = window._firebaseSignUp;
    const signOutFirebase = window._firebaseSignOut;

    // 2. DOM ELEMENTS
    const signInLink = document.querySelector('.sign-in-link');
    const signInText = document.querySelector('.sign-in-text');
    const lockIconContainer = document.querySelector('.custom-lock-icon');
    const accountNavLinks = document.querySelectorAll('#account-nav-link, #account-nav-mobile, .account-nav-link');
    const burger = document.querySelector('.custom-burger');
    const loginModal = document.getElementById('auth-modal');
    const signupModal = document.getElementById('signup-modal');

    if (!signInLink) return;

    // 3. UI HELPERS
    const closeAllModals = () => {
        window.deactivateFocusTrap?.('login');
        window.deactivateFocusTrap?.('signup');
        
        [loginModal, signupModal].forEach(modal => {
            if (modal) {
                modal.classList.remove('is-open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        document.body.classList.remove('drawer-open');
        document.body.style.overflow = '';
    };

    const openModal = (modal, trapId) => {
        closeAllModals();
        if (!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('drawer-open');
        document.body.style.overflow = 'hidden';
        
        // Focus the first input after animation
        setTimeout(() => {
            if (window.activateFocusTrap) {
                window.activateFocusTrap(modal.querySelector('.auth-modal-dialog'), trapId);
            } else {
                modal.querySelector('input')?.focus();
            }
        }, 100);
    };

    // 4. CORE INTERACTION LOGIC
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const isAccountPage = window.location.pathname.includes('account.html');

        if (isAccountPage && user) {
            signOutFirebase(auth).then(() => {
                window.location.href = 'index.html';
            });
        } else if (user) {
            window.location.href = 'account.html';
        } else {
            openModal(loginModal, 'login');
        }
    });

    // Toggle between Login and Signup modals
    document.getElementById('auth-toggle-mode')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signupModal, 'signup');
    });

    document.getElementById('back-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal, 'login');
    });

    // Closing triggers
    document.querySelectorAll('.auth-modal-close, .auth-modal-backdrop').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // 5. FORM SUBMISSION HANDLER (Combined Logic)
    const handleAuthForm = async (formId, actionFunc, msgId, btnId, isSignup = false) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgEl = document.getElementById(msgId);
            const btn = document.getElementById(btnId);
            
            const email = form.querySelector('input[type="email"]').value.trim();
            const pass = form.querySelector('input[type="password"]').value.trim();
            const name = isSignup ? document.getElementById('reg-name')?.value.trim() : null;

            if (isSignup && !name) {
                if (msgEl) msgEl.textContent = "Please enter your name";
                return;
            }

            window.LoadingState?.buttonStart(btn);
            if (msgEl) {
                msgEl.textContent = isSignup ? "Creating account..." : "Signing in...";
                msgEl.style.color = "var(--color-text-muted, #666)";
            }

            try {
                if (isSignup) {
                    await signUpFirebase(auth, email, pass, name);
                } else {
                    await signInFirebase(auth, email, pass);
                }
                
                if (msgEl) {
                    msgEl.style.color = "#28a745";
                    msgEl.textContent = "Success! Redirecting...";
                }
                setTimeout(() => window.location.href = 'account.html', 1500);
            } catch (err) {
                window.LoadingState?.buttonEnd(btn);
                if (msgEl) {
                    msgEl.style.color = "#dc3545";
                    msgEl.textContent = err.message.replace('Firebase: ', '').replace('Error ', '');
                }
            }
        });
    };

    handleAuthForm('auth-form', signInFirebase, 'auth-message', 'auth-submit-btn', false);
    handleAuthForm('signup-form', signUpFirebase, 'reg-message', 'reg-submit-btn', true);

    // 6. AUTH STATE OBSERVER
    onAuthChange(auth, (user) => {
        const isLoggedIn = !!user;
        const isAccountPage = window.location.pathname.includes('account.html');

        localStorage.setItem('kynar_auth_state', isLoggedIn ? 'logged_in' : 'logged_out');

        if (isLoggedIn) {
            // Update Text
            if (signInText) {
                signInText.textContent = isAccountPage ? 'Sign out' : (user.displayName?.split(' ')[0] || 'Account');
            }
            
            // Update Icon with Initial
            if (lockIconContainer) {
                const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
                lockIconContainer.innerHTML = `<span class="user-initial">${initial}</span>`;
                lockIconContainer.classList.add('active-user');
                lockIconContainer.style.borderColor = ''; // Clear inline styles
            }

            if (burger) burger.setAttribute('aria-label', `Menu for ${user.displayName || 'user'}`);
        } else {
            // Logged Out State
            if (signInText) signInText.textContent = 'Sign in';
            if (lockIconContainer) {
                lockIconContainer.innerHTML = `<img src="images/log-in-icon.png" alt="Sign in" style="width: 100%; height: 100%; object-fit: contain;">`;
                lockIconContainer.classList.remove('active-user');
                lockIconContainer.style.borderColor = '';
            }
            if (burger) burger.setAttribute('aria-label', 'Toggle navigation menu');
        }

        // Always enable navigation links
        accountNavLinks.forEach(link => {
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
        });
    });
}

// 7. BOOTSTRAP
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthUI);
} else {
    initAuthUI();
}
