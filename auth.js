/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR IDENTITY SERVICE (SUPABASE EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 * @description Manages secure Supabase authentication via Event Delegation.
 */

import { supabase } from './supabase-config.js';

const KynarAuth = (() => {
  
  // 1. INITIALIZATION
  function init() {
    monitorAuthState();
    bindGlobalEvents();
    console.log("Kynar Identity: Supabase System Active");
  }

  // 2. EVENT DELEGATION
  // Catches clicks/submits even if the Modal HTML is injected later
  function bindGlobalEvents() {
    
    // FORM SUBMITS
    document.addEventListener("submit", (e) => {
      if (e.target && e.target.id === "login-form") {
        handleLogin(e);
      }
      if (e.target && e.target.id === "register-form") {
        handleRegister(e);
      }
    });

    // CLICKS (Logout)
    document.addEventListener("click", (e) => {
      if (e.target && (e.target.id === "btn-logout" || e.target.closest("#btn-logout"))) {
        e.preventDefault();
        handleLogout();
      }
    });
  }

  // 3. AUTHENTICATION LOGIC

  // ➤ LOGIN
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;
    const btn = e.target.querySelector("button");

    setLoading(btn, true, "Authorizing...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass
      });

      if (error) throw error;

      // Success
      closeAuthInterface();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
      
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Authorization Failed: " + error.message);
    } finally {
      setLoading(btn, false, "Authorize Entry");
    }
  }

  // ➤ REGISTER
  async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;
    const btn = e.target.querySelector("button");

    setLoading(btn, true, "Verifying Identity...");

    try {
      // 1. Create User in Supabase
      // We pass 'full_name' in the options object so it saves to metadata immediately
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pass,
        options: {
          data: {
            full_name: name 
          }
        }
      });

      if (error) throw error;

      // 2. Success Feedback
      alert("Registration Successful! Please check your email to confirm.");
      closeAuthInterface();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 50, 100]);

    } catch (error) {
      console.error("Registration Error:", error.message);
      alert("Registration Failed: " + error.message);
    } finally {
      setLoading(btn, false, "Initialize Account");
    }
  }

  // ➤ LOGOUT
  async function handleLogout() {
    if (confirm("Terminate secure session?")) {
      try {
        await supabase.auth.signOut();
        // Clear any local storage flags
        localStorage.removeItem("kynar_auth_token");
        window.location.reload(); 
      } catch (error) {
        console.error("Logout Error:", error);
      }
    }
  }

  // 4. REACTIVE UI ENGINE
  function monitorAuthState() {
    // A. Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
    });

    // B. Listen for changes (Login/Logout events)
    supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });
  }

  function handleSessionChange(session) {
    const user = session?.user;

    if (user) {
      localStorage.setItem("kynar_auth_token", "active");
      updateAccountUI(user);
      
      // Broadcast Event for other modules (like Vault or Checkout)
      document.dispatchEvent(new CustomEvent("KynarAuthChanged", { detail: { user } }));
    } else {
      localStorage.removeItem("kynar_auth_token");
      resetAccountUI();
      document.dispatchEvent(new CustomEvent("KynarAuthChanged", { detail: { user: null } }));
    }
  }

  // Updates the Account Page UI
  function updateAccountUI(user) {
    const guestState = document.getElementById("state-guest");
    const userState = document.getElementById("state-user");
    const greeting = document.getElementById("user-greeting");
    const emailDisplay = document.getElementById("user-email-display");
    const avatar = document.getElementById("user-avatar-text"); // If you use avatars

    // Toggle Visibility
    if (guestState) guestState.style.display = "none";
    if (userState) userState.style.display = "block";

    // Update Text
    // Supabase stores extra data in user_metadata
    const displayName = user.user_metadata.full_name || "Verified Member";

    if (greeting) greeting.textContent = displayName;
    if (emailDisplay) emailDisplay.textContent = `ID: ${user.email}`;
    if (avatar && displayName) avatar.textContent = displayName.charAt(0).toUpperCase();
  }

  function resetAccountUI() {
    const guestState = document.getElementById("state-guest");
    const userState = document.getElementById("state-user");

    if (guestState) guestState.style.display = "block"; // or flex
    if (userState) userState.style.display = "none";
  }

  // 5. UTILITIES
  function closeAuthInterface() {
    // Helper from core.js or manual fallback
    if (window.KynarCore && window.KynarCore.closeAuthModal) {
      window.KynarCore.closeAuthModal();
    } else {
      const overlay = document.getElementById("modal-overlay");
      const modal = document.querySelector(".auth-modal"); // Assuming class name
      if (overlay) overlay.classList.remove('is-visible');
      if (modal) modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  }

  function setLoading(btn, isLoading, text) {
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent; // Store original text
      btn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-top-color:white; border-left-color: rgba(255,255,255,0.3); margin-right:8px; display:inline-block; border-radius:50%; border-style:solid; border-width:2px; animation:spin 1s linear infinite;"></span> ${text}`;
      btn.style.opacity = "0.8";
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || text;
      btn.style.opacity = "1";
    }
  }

  return { init };
})();

// Start Engine
KynarAuth.init();
