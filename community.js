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
    
            // ===== NEWSLETTER FORM (PROFESSIONAL VERSION) =====
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    const newsletterSuccess = document.getElementById('newsletter-success');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Simple validation
            if (emailInput.value.trim().length < 5) {
                newsletterMessage.style.color = 'var(--color-star-red)';
                newsletterMessage.textContent = 'Please enter a valid email address.';
                return;
            }
            
            // RECOMMENDATION #2: Show Spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Subscribing...';
            
            const formData = new FormData(newsletterForm);

            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // RECOMMENDATION #1: Switch to Success State
                    newsletterForm.style.display = 'none';
                    newsletterSuccess.style.display = 'block';
                } else {
                    // IF THERE IS AN ERROR:
                    const data = await response.json();
                    
                    // DO NOT hide the form here! Keep it visible so they can fix the error.
                    newsletterMessage.style.color = 'var(--color-star-red)';
                    newsletterMessage.textContent = data.errors ? data.errors[0].message : "Submission failed.";
                    
                    // Reset button so they can try again
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                newsletterMessage.style.color = 'var(--color-star-red)';
                newsletterMessage.textContent = "Connection error. Please try again.";
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    
    // ===== FEEDBACK FORM (PROFESSIONAL VERSION) =====
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackResponse = document.getElementById('feedback-message-response');
    const feedbackSuccess = document.getElementById('feedback-success');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const messageInput = document.getElementById('feedback-message');
            const emailInput = document.getElementById('feedback-email');

            if (emailInput.value.trim().length < 5 || messageInput.value.trim().length < 10) {
                feedbackResponse.style.color = '#490101';
                feedbackResponse.textContent = 'Please provide a valid email and a detailed message.';
                return;
            }
            
            // RECOMMENDATION #2: Show Spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

            const formData = new FormData(feedbackForm);

            try {
                const response = await fetch(feedbackForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // RECOMMENDATION #1: Switch to Success State
                    feedbackForm.style.display = 'none';
                    feedbackSuccess.style.display = 'block';
                } else {
                    const data = await response.json();
                    feedbackResponse.style.color = '#490101';
                    feedbackResponse.textContent = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem.";
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Feedback';
                }
            } catch (error) {
                feedbackResponse.style.color = '#490101';
                feedbackResponse.textContent = "Oops! Problem connecting to the server.";
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Feedback';
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
