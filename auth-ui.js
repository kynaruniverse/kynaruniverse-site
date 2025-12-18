// KYNAR - Auth UI wiring (uses globals set in index.html Firebase script)

const auth = window._firebaseAuth;
const onAuthChange = window._firebaseOnAuthStateChanged;
const signInFirebase = window._firebaseSignIn;
const signUpFirebase = window._firebaseSignUp;
const signOutFirebase = window._firebaseSignOut;

document.addEventListener('DOMContentLoaded', () => {
  const signInLink = document.querySelector('.sign-in-link');
  const signInText = document.querySelector('.sign-in-text');
  const accountNavLink = document.getElementById('account-nav-link');
  const authModal = document.getElementById('auth-modal');
  
  if (!auth || !signInLink || !authModal) return;
  
  const backdrop = authModal.querySelector('.auth-modal-backdrop');
  const closeBtn = authModal.querySelector('.auth-modal-close');
  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const displayNameRow = document.querySelector('.auth-display-name-row');
  const displayNameInput = document.getElementById('auth-display-name');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleModeBtn = document.getElementById('auth-toggle-mode');
  const messageEl = document.getElementById('auth-message');
  
  let mode = 'signin'; // 'signin' or 'signup'
  
  function openModal() {
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open'); // reuse scroll lock
    if (emailInput) emailInput.focus();
  }
  
  function closeModal() {
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (form) form.reset();
    if (messageEl) messageEl.textContent = '';
  }
  
  function updateModeUI() {
    if (!submitBtn || !toggleModeBtn) return;
    
    if (mode === 'signin') {
      submitBtn.textContent = 'Sign in';
      toggleModeBtn.textContent = 'Need an account? Sign up';
      if (displayNameRow) displayNameRow.style.display = 'none';
    } else {
      submitBtn.textContent = 'Create account';
      toggleModeBtn.textContent = 'Already have an account? Sign in';
      if (displayNameRow) displayNameRow.style.display = '';
    }
  }
  
  // Header icon: Sign in / Log out
  signInLink.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const label = signInText ? signInText.textContent.trim().toLowerCase() : '';
    
    if (label === 'log out') {
      // Treat as logout whenever the label says "Log out"
      try {
        await signOutFirebase(auth);
        window.location.href = 'index.html'; // refresh UI
      } catch (err) {
        console.error('Error signing out', err);
      }
    } else {
      // Treat as login when label says "Sign in"
      mode = 'signin';
      updateModeUI();
      openModal();
    }
  });
  
  // Toggle sign in / sign up in modal
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', () => {
      mode = mode === 'signin' ? 'signup' : 'signin';
      updateModeUI();
    });
  }
  
  // Close modal events
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('is-open')) {
      closeModal();
    }
  });
  
  // Form submit (Firebase Email/Password)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      
      if (messageEl) messageEl.textContent = '';
      submitBtn.disabled = true;
      
      const email = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value.trim() : '';
      const displayName = displayNameInput ? displayNameInput.value.trim() : '';
      
      try {
        if (mode === 'signin') {
          await signInFirebase(auth, email, pass);
        } else {
          await signUpFirebase(auth, email, pass, displayName);
        }
        window.location.href = 'account.html';
      } catch (err) {
        console.error(err);
        if (messageEl) {
          messageEl.textContent = (err.message || 'Error').replace('Firebase: ', '');
        }
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
  
  // Keep header text & Account link in sync with auth state
  onAuthChange(auth, (user) => {
    if (!signInText) return;
    
    if (user) {
      signInText.textContent = 'Log out';
      if (accountNavLink) {
        accountNavLink.style.pointerEvents = 'auto';
        accountNavLink.style.opacity = '1';
      }
    } else {
      signInText.textContent = 'Sign In';
      if (accountNavLink) {
        accountNavLink.style.pointerEvents = 'none';
        accountNavLink.style.opacity = '0.5';
      }
    }
  });
  
  // Set initial button text based on mode
  updateModeUI();
});