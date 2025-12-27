/**
 * QUIET FORGE SIGNALS
 * Role: Manage newsletter subscription and Gatekeeper Tokens
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LIVE SOCIAL PROOF (Dynamic)
    // Simulates a live counter that updates occasionally
    const strengthEl = document.getElementById('signal-strength');
    let subscribers = 1420; // Base number
    
    if (strengthEl) {
        strengthEl.textContent = subscribers.toLocaleString();
        
        setInterval(() => {
            // Randomly add a subscriber every few seconds
            if (Math.random() > 0.7) {
                subscribers++;
                strengthEl.textContent = subscribers.toLocaleString();
                // Trigger visual pulse if desired
            }
        }, 3000);
    }

    // 2. FORM HANDLING
    const form = document.getElementById('signal-form');
    const btn = document.getElementById('btn-signal');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Linking...';
            btn.style.opacity = '0.7';

            // Simulate API Call
            setTimeout(() => {
                const email = document.getElementById('email').value;
                
                // SAVE THE TOKEN (Critical for Gatekeeper)
                localStorage.setItem('kynar_signal_token', 'active'); 
                
                // Optional: Save email to simulated user
                const currentUser = JSON.parse(localStorage.getItem('kynar_user_token') || '{}');
                currentUser.email = email;
                localStorage.setItem('kynar_user_token', JSON.stringify(currentUser));

                // Success Feedback
                btn.textContent = 'Connection Established';
                btn.style.background = '#4CAF50'; // Success Green
                if (window.Haptics) window.Haptics.success();

                alert(`Welcome to the Signal, ${email}. Your access is granted.`);
                
                // Redirect to Archive so they can use their new access
                window.location.href = 'archive.html';

            }, 1500);
        });
    }
    
    // 3. PULSE ANIMATION (Visual Magic)
    const pulseIcon = document.getElementById('signal-pulse');
    if (pulseIcon) {
        pulseIcon.innerHTML += `
            <style>
                @keyframes signalRipple {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(3); opacity: 0; }
                }
                .ripple {
                    position: absolute;
                    width: 100%; height: 100%;
                    border: 1px solid var(--ink-primary);
                    border-radius: 50%;
                    animation: signalRipple 3s infinite linear;
                }
            </style>
            <div class="ripple" style="animation-delay: 0s;"></div>
            <div class="ripple" style="animation-delay: 1s;"></div>
        `;
    }
});
