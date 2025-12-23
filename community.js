/**
 * KYNAR UNIVERSE - Community Page Module
 * Handles: FAQ Accordion, Formspree Submissions, Scroll interactions
 */

const CommunityPage = (() => {

    // --- 1. UTILITIES ---
    
    // Simple Email Regex for client-side validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Generic Form Handler for Formspree
    const handleFormSubmission = async (config) => {
        const { formId, successId, responseId, btnText } = config;
        
        const form = document.getElementById(formId);
        const successMsg = document.getElementById(successId);
        const responseMsg = document.getElementById(responseId); // Optional error container
        
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            
            // 1. Validation
            if (emailInput && !isValidEmail(emailInput.value)) {
                if (responseMsg) {
                    responseMsg.textContent = "Please enter a valid email address.";
                    responseMsg.style.color = "var(--color-star-red)";
                } else {
                    alert("Please enter a valid email address.");
                }
                return;
            }

            // 2. Loading State
            const originalText = submitBtn.innerText;
            submitBtn.classList.add('btn-loading'); // Uses CSS spinner
            submitBtn.disabled = true;

            // 3. Prepare Data
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // 4. Success
                    form.reset();
                    form.style.display = 'none';
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.focus(); // Accessibility focus
                    }
                } else {
                    // 5. Error from Server
                    const data = await response.json();
                    throw new Error(data.errors ? data.errors.map(err => err.message).join(", ") : "Submission failed");
                }
            } catch (error) {
                // 6. Handle Network/API Errors
                console.error('Form Error:', error);
                if (responseMsg) {
                    responseMsg.textContent = "Error: " + error.message;
                    responseMsg.style.color = "var(--color-star-red)";
                } else {
                    alert("Something went wrong. Please try again.");
                }
            } finally {
                // 7. Reset Button State
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
            }
        });
    };

    // --- 2. FAQ LOGIC ---
    
    const initFAQ = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            const answerPanel = item.querySelector('.faq-answer');
            
            if (!questionBtn || !answerPanel) return;

            // Set initial ARIA states
            questionBtn.setAttribute('aria-expanded', 'false');
            answerPanel.setAttribute('aria-hidden', 'true');

            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others (Accordion behavior)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        const otherPanel = otherItem.querySelector('.faq-answer');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherPanel) otherPanel.setAttribute('aria-hidden', 'true');
                    }
                });

                // Toggle current
                item.classList.toggle('active');
                questionBtn.setAttribute('aria-expanded', !isActive);
                answerPanel.setAttribute('aria-hidden', isActive); // If was active, now hidden
            });
        });
    };

    // --- 3. INIT ---
    
    const init = () => {
        // Initialize FAQ
        initFAQ();

        // Initialize Newsletter Form
        handleFormSubmission({
            formId: 'newsletter-form',
            successId: 'newsletter-success',
            responseId: 'newsletter-message', // Note: You might need to add this <p> to your HTML if you want inline errors
            btnText: 'Subscribe'
        });

        // Initialize Feedback Form
        handleFormSubmission({
            formId: 'feedback-form',
            successId: 'feedback-success',
            responseId: 'feedback-message-response',
            btnText: 'Send Feedback'
        });

        // Smooth Scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        console.log('✨ Community Module Loaded');
    };

    return { init };

})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', CommunityPage.init);
