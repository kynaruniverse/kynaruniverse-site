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
  const lockIconContainer = document.querySelector('.custom-lock-icon');
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

  // --- Sign In / Sign Out Button Logic ---
    // --- Helper: Open/Close Logic ---
  signInLink.addEventListener('click', (e) => {
    const user = auth.currentUser;
    if (user) {
      // If logged in, let the browser follow the link to account.html
      window.location.href = 'account.html';
    } else {
      // If NOT logged in, stop the link and open the login modal
      e.preventDefault();
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

  // --- Modal Switching ---
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

    if (btn) btn.disabled = true;
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
      if (btn) btn.disabled = false;
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

    if (btn) btn.disabled = true;
    if (msgEl) msgEl.textContent = "Creating account...";

    try {
      await window._firebaseSignUp(auth, email, pass, name);
      if (msgEl) {
        msgEl.style.color = "#28a745";
        msgEl.textContent = "Account created! Redirecting...";
      }
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 2000);
    } catch (err) {
      if (btn) btn.disabled = false;
      if (msgEl) {
        msgEl.style.color = "#dc3545";
        msgEl.textContent = err.message.replace('Firebase: ', '');
      }
    }
  });

  // --- AUTH STATE UI UPDATES ---
  onAuthChange(auth, (user) => {
    const isLoggedIn = !!user;
    localStorage.setItem('kynar_auth_state', isLoggedIn ? 'logged_in' : 'logged_out');

    if (isLoggedIn) {
      // 1. Update text to show "Account" or User Name
      if (signInText) {
        signInText.textContent = user.displayName ? user.displayName.split(' ')[0] : 'Account';
      }
      // 2. Change Lock Icon to a User Icon or Initial
      if (lockIconContainer) {
        const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
        lockIconContainer.innerHTML = `<span style="font-family:'Bantayog'; font-weight:bold; color:var(--color-star-red);">${initial}</span>`;
      }
    } else {
      // 1. Revert to Sign In text
      if (signInText) signInText.textContent = 'Sign in';
      // 2. Revert to Lock Icon
      if (lockIconContainer) {
        lockIconContainer.innerHTML = `<i class="fa-solid fa-lock"></i>`;
      }
    }
    
    accountNavLinks.forEach(link => {
      link.style.opacity = '1';
      link.style.pointerEvents = 'auto';
    });
  });
});
