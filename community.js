/* ============================================================
   KYNAR UNIVERSE - COMMUNITY PAGE JAVASCRIPT
   Handles: FAQ Accordion, Newsletter, Story Submissions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
    
    // ===== NEWSLETTER FORM (FORMSPREE AJAX) =====
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // --- VALIDATION BLOCK START ---
            if (emailInput.value.trim().length < 5) {
                newsletterMessage.style.color = 'var(--color-star-red)';
                newsletterMessage.textContent = 'Please enter a valid email address.';
                return; // Stops the function here
            }
            // --- VALIDATION BLOCK END ---
            
            // Visual feedback (Only runs if validation passes)
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            newsletterMessage.style.color = 'rgba(17,17,17,0.6)';
            newsletterMessage.textContent = 'Processing your subscription...';
            
            const formData = new FormData(newsletterForm);

            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    newsletterMessage.style.color = '#28a745';
                    newsletterMessage.textContent = '✓ Success! Check your email to confirm.';
                    newsletterForm.reset(); 
                } else {
                    const data = await response.json();
                    newsletterMessage.style.color = 'var(--color-star-red)';
                    newsletterMessage.textContent = data.errors ? data.errors[0].message : "Submission failed.";
                }
            } catch (error) {
                newsletterMessage.style.color = 'var(--color-star-red)';
                newsletterMessage.textContent = "Connection error. Please try again.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                setTimeout(() => { newsletterMessage.textContent = ''; }, 5000);
            }
        });
    }
    
    // ===== FEEDBACK FORM (FORMSPREE AJAX INTEGRATION) =====
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackResponse = document.getElementById('feedback-message-response');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const messageInput = document.getElementById('feedback-message');
            const emailInput = document.getElementById('feedback-email');

            // --- VALIDATION BLOCK START ---
            // Checking if email is valid and message isn't too short
            if (emailInput.value.trim().length < 5 || messageInput.value.trim().length < 10) {
                feedbackResponse.style.color = '#490101'; // Your star-red
                feedbackResponse.textContent = 'Please provide a valid email and a detailed message.';
                return; // Stops the function here
            }
            // --- VALIDATION BLOCK END ---
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            feedbackResponse.style.color = '#666';
            feedbackResponse.textContent = 'Submitting your feedback...';

            const formData = new FormData(feedbackForm);

            try {
                const response = await fetch(feedbackForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    feedbackResponse.style.color = '#28a745';
                    feedbackResponse.textContent = '✓ Thank you! Your feedback has been sent.';
                    feedbackForm.reset();
                } else {
                    const data = await response.json();
                    feedbackResponse.style.color = '#490101';
                    feedbackResponse.textContent = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem.";
                }
            } catch (error) {
                feedbackResponse.style.color = '#490101';
                feedbackResponse.textContent = "Oops! Problem connecting to the server.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Feedback';
                setTimeout(() => { feedbackResponse.textContent = ''; }, 6000);
            }
        });
    }
    
    // ===== SMOOTH SCROLL TO SECTIONS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    console.log('✅ Community page loaded successfully');
});
