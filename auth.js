/**
 * SOFT ROYAL AUTH SYSTEM
 * Role: Handle Firebase Login, Registration, and Identity State
 */

import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const AuthSystem = (() => {

    // --- 1. INITIALIZATION ---
    function init() {
        // Listen for the global "Modals Loaded" event from core.js
        document.addEventListener('ForgeModalsLoaded', () => {
            setupListeners();
        });

        // Also run immediately in case modals loaded before this script
        if (document.getElementById('modal-overlay')) {
            setupListeners();
        }

        // Start Firebase Listener
        monitorAuthState();
        
        console.log('Soft Royal Auth: Online');
    }

    // --- 2. EVENT LISTENERS ---
    function setupListeners() {
        const loginForm = document.getElementById('login-form');
        const regForm = document.getElementById('register-form');
        const logoutBtn = document.getElementById('btn-logout');

        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (regForm) regForm.addEventListener('submit', handleRegister);
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }

    // --- 3. AUTH HANDLERS ---
    
    // LOGIN
    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const btn = e.target.querySelector('button');
        
        setLoading(btn, true, 'Authenticating...');

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // Success handled by monitorAuthState
            closeModal();
            if (window.Haptics) window.Haptics.success();
        } catch (error) {
            console.error(error);
            alert("Authentication Failed: " + error.message);
            setLoading(btn, false, 'Connect Identity');
        }
    }

    // REGISTER
    async function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const btn = e.target.querySelector('button');

        setLoading(btn, true, 'Creating Ledger...');

        try {
            // 1. Create Auth User
            const userCred = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCred.user;

            // 2. Update Profile Name
            await updateProfile(user, { displayName: name });

            // 3. Create Firestore Entry
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                tier: 'traveler', // Default tier
                createdAt: new Date().toISOString()
            });

            // Success handled by monitorAuthState
            closeModal();
            if (window.Haptics) window.Haptics.success();

        } catch (error) {
            console.error(error);
            alert("Registration Failed: " + error.message);
            setLoading(btn, false, 'Create Ledger');
        }
    }

    // LOGOUT
    async function handleLogout() {
        if (confirm("Disconnect identity?")) {
            try {
                await signOut(auth);
                // Force reload to clear any local state/cache visually
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        }
    }

    // --- 4. STATE MONITOR ---
    function monitorAuthState() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // USER IS LOGGED IN
                console.log('User detected:', user.email);
                
                // Save token for non-firebase scripts (like cart gatekeeper)
                localStorage.setItem('kynar_signal_token', 'active');
                
                // Update UI on Identity Page
                updateIdentityUI(user);
                
            } else {
                // USER IS LOGGED OUT
                localStorage.removeItem('kynar_signal_token');
                resetIdentityUI();
            }
        });
    }

    // --- 5. UI UPDATERS ---
    
    function updateIdentityUI(user) {
        // Only run if we are on the identity page
        const guestState = document.getElementById('state-guest');
        const userState = document.getElementById('state-user');
        const greeting = document.getElementById('user-greeting');
        const emailDisplay = document.getElementById('user-email-display');

        if (guestState && userState) {
            guestState.style.display = 'none';
            userState.style.display = 'block';
            
            // Fade In
            setTimeout(() => {
                userState.style.opacity = '1';
                userState.style.transform = 'translateY(0)';
            }, 50);
        }

        if (greeting) greeting.textContent = user.displayName || 'Traveler';
        if (emailDisplay) emailDisplay.textContent = user.email;
    }

    function resetIdentityUI() {
        const guestState = document.getElementById('state-guest');
        const userState = document.getElementById('state-user');

        if (guestState && userState) {
            guestState.style.display = 'flex'; // Flex for centering
            userState.style.display = 'none';
        }
    }

    // --- HELPERS ---
    function closeModal() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    }

    function setLoading(btn, isLoading, text) {
        if (isLoading) {
            btn.originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border:2px solid white; border-top-color:transparent; border-radius:50%; display:inline-block; animation:spin 1s linear infinite; margin-right:8px; vertical-align:middle;"></span> ${text}`;
            btn.style.opacity = '0.7';
        } else {
            btn.disabled = false;
            btn.textContent = text;
            btn.style.opacity = '1';
        }
    }

    // Add spinner keyframes dynamically if needed
    if (!document.getElementById('forge-spin-style')) {
        const style = document.createElement('style');
        style.id = 'forge-spin-style';
        style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }

    return { init };

})();

AuthSystem.init();
