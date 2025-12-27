/**
 * SOFT ROYAL SIGNAL LOGIC
 * Role: Manage frequency (newsletter) subscription and Gatekeeper Tokens
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LIVE SIGNAL STRENGTH (Social Proof) ---
    // Simulates a live counter of architects currently "tuned in"
    const strengthEl = document.getElementById('signal-strength');
    
    // Start with a specific base number to feel established
    let subscribers = 1420; 
    
    if (strengthEl) {
        // Initial render
        strengthEl.textContent = subscribers.toLocaleString();
        
        // Dynamic update loop (Simulates live activity)
        setInterval(() => {
            // 30% chance to gain a new subscriber every 4 seconds
            if (Math.random() > 0.7) {
                subscribers++;
                
                // Animate the change visually
                strengthEl.style.opacity = '0';
                setTimeout(() => {
                    strengthEl.textContent = subscribers.toLocaleString();
                    strengthEl.style.opacity = '1';
                }, 200);
            }
        }, 4000);
    }

    // --- 2. TRANSMISSION HANDLER (Form Submit) ---
    const form = document.getElementById('signal-form');
    const btn = document.getElementById('btn-signal');
    const emailInput = document.getElementById('email');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // UI: Loading State
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border:2px solid white; border-top-color:transparent; border-radius:50%; display:inline-block; animation:spin 1s linear infinite; margin-right:8px; vertical-align:middle;"></span> Establishing Connection...`;
            btn.style.opacity = '0.8';

            // Simulate Network Request
            setTimeout(() => {
                const email = emailInput.value;
                
                // CORE LOGIC: Save the Token
                // This token allows the user to download "Free" items in the Cart/Archive
                localStorage.setItem('kynar_signal_token', 'active'); 
                
                // Optional: Update User Profile if they are logged in via Auth
                const currentUserToken = localStorage.getItem('kynar_user_token');
                if (currentUserToken) {
                    // We don't overwrite the whole object, just log it for now
                    console.log(`Signal linked to Identity: ${email}`);
                }

                // UI: Success State
                btn.innerHTML = `✔ Signal Established`;
                btn.style.background = '#10B981'; // Emerald Success
                btn.style.color = 'white';
                
                if (window.Haptics) window.Haptics.success();

                // Redirect Flow
                setTimeout(() => {
                    alert(`Welcome to the Frequency, ${email}.\nFree artifacts are now unlocked.`);
                    window.location.href = 'archive.html';
                }, 800);

            }, 1500);
        });
    }

    // Add CSS for spinner if not present globally
    if (!document.getElementById('signal-css')) {
        const style = document.createElement('style');
        style.id = 'signal-css';
        style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
});
