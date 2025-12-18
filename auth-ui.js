// KYNAR - Auth UI wiring
const auth            = window._firebaseAuth;
const onAuthChange    = window._firebaseOnAuthStateChanged;
const signInFirebase  = window._firebaseSignIn;
const signUpFirebase  = window._firebaseSignUp;
const signOutFirebase = window._firebaseSignOut;

document.addEventListener('DOMContentLoaded', () => {
  const signInLink     = document.querySelector('.sign-in-link');
  const signInText     = document.querySelector('.sign-in-text');
  const accountNavLink = document.getElementById('account-nav-link');
  const authModal      = document.getElementById('auth-modal');
  
  if (!signInLink || !authModal) return;

  const backdrop       = authModal.querySelector('.auth-modal-backdrop');
  const closeBtn       = authModal.querySelector('.auth-modal-close');
  const form           = document.getElementById('auth-form');
  const emailInput     = document.getElementById('auth-email');
  const passInput      = document.getElementById('auth-password');
  const displayNameRow = document.querySelector('.auth-display-name-row');
  const displayNameInput = document.getElementById('auth-display-name');
  const submitBtn      = document.getElementById('auth-submit-btn');
  const toggleModeBtn  = document.getElementById('auth-toggle-mode');
  const messageEl      = document.getElementById('auth-message');
  
  let mode = 'signin'; 

  const openModal = () => {
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    if (emailInput) emailInput.focus();
  };

  const closeModal = () => {
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (form) form.reset();
    if (messageEl) messageEl.textContent = '';
  };

  const updateModeUI = () => {
    const isSignIn = mode === 'signin';
    submitBtn.textContent = isSignIn ? 'Sign in' : 'Create account';
    toggleModeBtn.textContent = isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in';
    if (displayNameRow) displayNameRow.style.display = isSignIn ? 'none' : '';
  };

  // --- Listeners ---

  signInLink.addEventListener('click', async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await signOutFirebase(auth);
        window.location.reload(); 
      } catch (err) { console.error('Logout failed:', err); }
    } else {
      mode = 'signin';
      updateModeUI();
      openModal();
    }
  });

  // NEW INTERCEPTOR
  if (accountNavLink) {
    accountNavLink.addEventListener('click', (e) => {
      if (!auth.currentUser) {
        e.preventDefault();
        mode = 'signin';
        updateModeUI();
        openModal();
      }
    });
  }

  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', () => {
      mode = (mode === 'signin') ? 'signup' : 'signin';
      updateModeUI();
    });
  }

  [closeBtn, backdrop].forEach(el => el?.addEventListener('click', closeModal));
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('is-open')) closeModal();
  });

    // Updated Form Submission with Success Messages
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (messageEl) {
      messageEl.textContent = '';
      messageEl.style.color = ''; // Reset color from potential previous errors
    }
    submitBtn.disabled = true;

    try {
      const email = emailInput.value.trim();
      const pass = passInput.value.trim();
      
      let successMessage = "";

      if (mode === 'signin') {
        await signInFirebase(auth, email, pass);
        successMessage = "Welcome back! Redirecting...";
      } else {
        const dName = displayNameInput.value.trim();
        await signUpFirebase(auth, email, pass, dName);
        successMessage = "Account created! Welcome to the Universe.";
      }

      // Show success feedback
      if (messageEl) {
        messageEl.textContent = successMessage;
        messageEl.style.color = "#28a745"; // Success green
      }

      // Brief delay so they can actually read the message
      setTimeout(() => {
        closeModal();
        window.location.href = 'account.html';
      }, 1500);

    } catch (err) {
      submitBtn.disabled = false; // Re-enable only on error
      if (messageEl) {
        messageEl.textContent = err.message.replace('Firebase: ', '');
        messageEl.style.color = "#dc3545"; // Error red
      }
    }
  });


  onAuthChange(auth, (user) => {
    if (signInText) signInText.textContent = !!user ? 'Sign out' : 'Sign in';
    if (accountNavLink) {
      accountNavLink.style.opacity = '1';
      accountNavLink.style.pointerEvents = 'auto';
    }
  });

  updateModeUI();
});
