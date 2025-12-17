// KYNAR - Auth UI wiring (uses globals set in index.html Firebase script)

const auth             = window._firebaseAuth;
const onAuthChange     = window._firebaseOnAuthStateChanged;
const signInFirebase   = window._firebaseSignIn;
const signUpFirebase   = window._firebaseSignUp;
const signOutFirebase  = window._firebaseSignOut;

document.addEventListener('DOMContentLoaded', () => {
  const signInLink    = document.querySelector('.sign-in-link');
  const signInText    = document.querySelector('.sign-in-text');
    const accountNavLink = document.getElementById('account-nav-link');
  const authModal     = document.getElementById('auth-modal');

  if (!auth || !signInLink || !authModal) return;
  
    const accountPanel   = document.getElementById('account-panel');
  const accountEmailEl = document.getElementById('account-email-text');
  const accountLogout  = document.getElementById('account-logout-btn');

  const backdrop      = authModal.querySelector('.auth-modal-backdrop');
  const closeBtn      = authModal.querySelector('.auth-modal-close');
  const form          = document.getElementById('auth-form');
  const emailInput    = document.getElementById('auth-email');
  const passInput     = document.getElementById('auth-password');
  const displayNameRow= document.querySelector('.auth-display-name-row');
  const displayNameInput = document.getElementById('auth-display-name');
  const submitBtn     = document.getElementById('auth-submit-btn');
  const toggleModeBtn = document.getElementById('auth-toggle-mode');
  const messageEl     = document.getElementById('auth-message');

  let mode = 'signin'; // 'signin' or 'signup'

  function openModal() {
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open'); // reuse scroll lock
    emailInput.focus();
  }

  function closeModal() {
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    form.reset();
    messageEl.textContent = '';
  }

  function updateModeUI() {
    if (mode === 'signin') {
      submitBtn.textContent = 'Sign in';
      toggleModeBtn.textContent = 'Need an account? Sign up';
    } else {
      submitBtn.textContent = 'Create account';
      toggleModeBtn.textContent = 'Already have an account? Sign in';
    }
  }

  // Click on header lock icon
  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      // If logged in, clicking acts as log out
      signOutFirebase(auth).catch(console.error);
    } else {
      mode = 'signin';
      updateModeUI();
      openModal();
    }
  });
  
    // Log out from account panel button
  if (accountLogout) {
    accountLogout.addEventListener('click', () => {
      signOutFirebase(auth).catch(console.error);
    });
  }

  // Toggle sign in / sign up
  toggleModeBtn.addEventListener('click', () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    updateModeUI();
  });

  // Close modal events
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form submit (Firebase Email/Password)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = '';
    submitBtn.disabled = true;

    const email = emailInput.value.trim();
    const pass  = passInput.value.trim();

    try {
      if (mode === 'signin') {
        await signInFirebase(auth, email, pass);
      } else {
        await signUpFirebase(auth, email, pass, displayName);
      }
      window.location.href = 'account.html';
    } catch (err) {
      console.error(err);
      messageEl.textContent = (err.message || 'Error').replace('Firebase: ', '');
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Keep header text in sync with auth state
      onAuthChange(auth, (user) => {
    if (user) {
      signInText.textContent = 'Log out';
      if (accountNavLink) {
        accountNavLink.style.pointerEvents = 'auto';
        accountNavLink.style.opacity = '1';
      }
    } else {
      signInText.textContent = 'Sign in';
      if (accountNavLink) {
        accountNavLink.style.pointerEvents = 'none'; // looks there but not clickable
        accountNavLink.style.opacity = '0.5';
      }
    }
  });
});