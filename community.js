/**
 * KYNAR UNIVERSE - Community Nexus Logic
 * Architect: AetherCode
 * Evolution: Platinum Plus Elastic Edition
 */

const CommunityPage = (() => {

    // --- 1. FORM HANDLING ENGINE (HAPTIC FEEDBACK) ---

    const setupForms = () => {
        // A. VIP Terminal Form
        const vipForm = document.getElementById('nexus-vip-form');
        if (vipForm) {
            vipForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = vipForm.querySelector('button');
                const input = vipForm.querySelector('input');

                // 1. Utilize LoadingState Utility (if available)
                if (window.LoadingState) {
                    window.LoadingState.buttonStart(btn);
                } else {
                    btn.disabled = true;
                    btn.textContent = 'SYNCHRONIZING...';
                }

                // Simulate Network Transmission
                setTimeout(() => {
                    // 2. Success State: Cyber Green (Tactile Logic)
                    if (window.LoadingState) {
                        // buttonEnd handles the color transition to green and text swap
                        window.LoadingState.buttonEnd(btn, "SYNCHRONIZED");
                    } else {
                        btn.style.background = '#00ff9d';
                        btn.style.color = '#000';
                        btn.textContent = 'SYNCHRONIZED';
                    }
                    
                    input.value = ''; // Clear transmission buffer

                    // 3. Reset Protocol
                    setTimeout(() => {
                        if (window.LoadingState) {
                            // Logic to return button to original state
                            btn.classList.remove('btn-loading');
                            btn.style.background = '';
                            btn.style.color = '';
                            btn.textContent = 'INITIALIZE';
                            btn.disabled = false;
                        }
                    }, 4000);
                }, 1500);
            });
        }

        // B. Signal Report (Feedback)
        const feedbackForm = document.querySelector('.feedback-mini-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = feedbackForm.querySelector('button');
                
                if (window.LoadingState) window.LoadingState.buttonStart(btn);
                
                setTimeout(() => {
                    if (window.LoadingState) window.LoadingState.buttonEnd(btn, "TRANSMITTED");
                    
                    setTimeout(() => {
                        feedbackForm.reset();
                        btn.disabled = false;
                    }, 3000);
                }, 1200);
            });
        }
    };

    // --- 2. ELASTIC FAQ ACCORDION ---
    
    const initFAQ = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            
            if (!questionBtn) return;

            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Protocol: Close others to maintain spatial focus
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle Current (Transitions handled via CSS Bezier)
                item.classList.toggle('active');
                
                // Haptic alignment if opening
                if (!isOpen) {
                    setTimeout(() => {
                        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            });
        });
    };

    // --- 3. INITIALIZATION ---
    
    const init = () => {
        initFAQ();
        setupForms();
        console.log('✨ Nexus Protocol Synchronized');
    };

    return { init };

})();

// Initialize when Components are Ready
document.addEventListener('componentsLoaded', () => CommunityPage.init());

// Fallback for direct page access
if (document.readyState !== 'loading') {
    CommunityPage.init();
}
