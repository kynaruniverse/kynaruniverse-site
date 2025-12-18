// KYNAR - Full Auth UI wiring
const auth            = window._firebaseAuth;
const onAuthChange    = window._firebaseOnAuthStateChanged;
const signInFirebase  = window._firebaseSignIn;
const signUpFirebase  = window._firebaseSignUp;
const signOutFirebase = window._firebaseSignOut;

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const signInLink      = document.querySelector('.sign-in-link');
  const signInText      = document.querySelector('.sign-in-text');
  const accountNavLinks = document.querySelectorAll('#account-nav-link, #account-nav-mobile');
  
  // Modals
  const loginModal      = document.getElementById('auth-modal');
  const signupModal     = document.getElementById('signup-modal');

  if (!signInLink) return;

  // --- Helper: Open/Close Logic ---
  const openLogin = () => {
    if (!loginModal) return;
    signupModal?.classList.remove('is-open');
    loginModal.classList.add('is-open');
    document.body.classList.add('drawer-open');
    document.getElementById('auth-email')?.focus();
  };

  const openSignup = () => {
    if (!signupModal) return;
    loginModal?.classList.remove('is-open');
    signupModal.classList.add('is-open');
    document.body.classList.add('drawer-open');
    document.getElementById('reg-name')?.focus();
  };

  const closeAllModals = () => {
    loginModal?.classList.remove('is-open');
    signupModal?.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
  };

  // --- Sign In / Sign Out Button ---
  signInLink.addEventListener('click', async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await signOutFirebase(auth);
        window.location.reload(); 
      } catch (err) { console.error('Logout failed:', err); }
    } else {
      openLogin();
    }
  });

  // --- Interceptors (Account Links) ---
  accountNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!auth.currentUser) {
        e.preventDefault();
        openLogin();
      }
    });
  });

  // --- Modal Switching (Swapping) ---
  document.getElementById('auth-toggle-mode')?.addEventListener('click', (e) => {
    e.preventDefault();
    openSignup();
  });

  document.getElementById('back-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    openLogin();
  });

  // --- Close Listeners ---
  const closeButtons = document.querySelectorAll('.auth-modal-close, .auth-modal-backdrop');
  closeButtons.forEach(btn => btn.addEventListener('click', closeAllModals));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // --- LOGIN FORM SUBMISSION ---
  const loginForm = document.getElementById('auth-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('auth-message');
    const btn = document.getElementById('auth-submit-btn');
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-password').value.trim();

    btn.disabled = true;
    if (msgEl) msgEl.textContent = "Signing in...";

    try {
      await signInFirebase(auth, email, pass);
      if (msgEl) {
        msgEl.style.color = "#28a745";
        msgEl.textContent = "Welcome back! Redirecting...";
      }
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1500);
    } catch (err) {
      btn.disabled = false;
      if (msgEl) {
        msgEl.style.color = "#dc3545";
        msgEl.textContent = err.message.replace('Firebase: ', '');
      }
    }
  });

  // --- SIGNUP FORM SUBMISSION ---
  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('reg-message');
    const btn = document.getElementById('reg-submit-btn');
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    btn.disabled = true;
    if (msgEl) msgEl.textContent = "Creating account...";

    try {
      // Calls the global helper in index.html
      await window._firebaseSignUp(auth, email, pass, name);
      
      if (msgEl) {
        msgEl.style.color = "#28a745";
        msgEl.textContent = "Account created! Redirecting...";
      }

      setTimeout(() => {
        window.location.href = 'account.html';
      }, 2000);
    } catch (err) {
      btn.disabled = false;
      if (msgEl) {
        msgEl.style.color = "#dc3545";
        msgEl.textContent = err.message.replace('Firebase: ', '');
      }
    }
  });

    // --- Auth State UI Updates ---
  onAuthChange(auth, (user) => {
    const isLoggedIn = !!user;
    
    localStorage.setItem('kynar_auth_state', isLoggedIn ? 'logged_in' : 'logged_out');

    // 2. Update the text as usual
    if (signInText) signInText.textContent = isLoggedIn ? 'Sign out' : 'Sign in';
    
    accountNavLinks.forEach(link => {
      link.style.opacity = '1';
      link.style.pointerEvents = 'auto';
    });
  });

});
