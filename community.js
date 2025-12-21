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
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            
            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            // Show loading message
            newsletterMessage.style.color = '#666';
            newsletterMessage.textContent = 'Processing...';
            
            // Simulate API call (replace with your actual newsletter service)
            setTimeout(() => {
                // Success
                newsletterMessage.style.color = '#28a745';
                newsletterMessage.textContent = '✓ Success! Check your email to confirm subscription.';
                emailInput.value = '';
                submitBtn.textContent = 'Subscribe';
                submitBtn.disabled = false;
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    newsletterMessage.textContent = '';
                }, 5000);
                
                // TODO: Integrate with actual newsletter service
                // Examples: Mailchimp, ConvertKit, Substack API
                console.log('Newsletter signup:', email);
            }, 1500);
        });
    }
    
    // ===== FEEDBACK SUBMISSION FORM (SENDS TO EMAIL) =====
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackResponse = document.getElementById('feedback-message-response');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('feedback-name');
            const emailInput = document.getElementById('feedback-email');
            const typeInput = document.getElementById('feedback-type');
            const messageInput = document.getElementById('feedback-message');
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                type: typeInput.value,
                message: messageInput.value.trim()
            };
            
            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Show loading message
            feedbackResponse.style.color = '#666';
            feedbackResponse.textContent = 'Sending your feedback...';
            
            // Create mailto link with feedback details
            const subject = `KYNAR Universe Feedback: ${typeInput.options[typeInput.selectedIndex].text}`;
            const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AType: ${typeInput.options[typeInput.selectedIndex].text}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(formData.message)}`;
            const mailtoLink = `mailto:Kynaruniverse@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Open mailto link
            window.location.href = mailtoLink;
            
            // Show success message
            setTimeout(() => {
                feedbackResponse.style.color = '#28a745';
                feedbackResponse.textContent = '✓ Email client opened! Your feedback will be sent via email.';
                
                // Clear form
                nameInput.value = '';
                emailInput.value = '';
                typeInput.value = '';
                messageInput.value = '';
                
                submitBtn.textContent = 'Send Feedback';
                submitBtn.disabled = false;
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    feedbackResponse.textContent = '';
                }, 5000);
            }, 1000);
        });
    }
    
    // ===== REMOVE OLD STORY FORM CODE =====
    // (The character counter and story submission code is removed)
    
    // ===== REMOVE ANIMATED COUNTER =====
    // (The member count animation is removed since we don't have stats yet)
    
    // ===== SMOOTH SCROLL TO SECTIONS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty hash or just "#"
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Community page loaded successfully');
});