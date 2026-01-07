/* js/main.js */

/**
 * KYNAR UNIVERSE - MODULAR CORE
 * Architecture: Organized Module Pattern
 */

const KynarApp = {
    init() {
        this.UI.initMobileMenu();
        this.UI.initThemeToggle();
        this.UI.initFilterChips();
        this.UI.initCopyright();
        this.UI.initCookieBanner();
        this.UI.highlightCurrentPage();
        
        this.Commerce.initCheckoutFormatting();
        this.Commerce.initFormValidation();
        
        this.Utils.initCodeCopy();
    },
    
    /* --- UI & INTERACTION MODULE --- */
    UI: {
        initMobileMenu() {
            const allToggles = document.querySelectorAll('.menu-toggle');
            const menuToggles = Array.from(allToggles).filter(btn => btn.id !== 'theme-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
            
            if (!menuToggles.length || !mobileMenu) return;
            
            const toggle = (forceClose = false) => {
                const isActive = mobileMenu.classList.contains('is-active');
                if (forceClose && !isActive) return;
                
                mobileMenu.classList.toggle('is-active', !forceClose ? !isActive : false);
                const nowActive = mobileMenu.classList.contains('is-active');
                document.body.style.overflow = nowActive ? 'hidden' : '';
                menuToggles.forEach(btn => btn.setAttribute('aria-expanded', nowActive));
                
                // Accessibility: Focus management
                if (nowActive) {
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            };
            
            menuToggles.forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation();
                toggle(); }));
            mobileMenu.addEventListener('click', (e) => { if (e.target === mobileMenu) toggle(true); });
            menuLinks.forEach(link => link.addEventListener('click', () => toggle(true)));
        },
        
        initThemeToggle() {
            const themeBtn = document.getElementById('theme-toggle');
            const html = document.documentElement;
            if (localStorage.getItem('theme') === 'dark') html.setAttribute('data-theme', 'dark');
            if (!themeBtn) return;
            
            themeBtn.addEventListener('click', () => {
                const isDark = html.getAttribute('data-theme') === 'dark';
                html.toggleAttribute('data-theme', !isDark);
                localStorage.setItem('theme', !isDark ? 'dark' : 'light');
            });
        },
        
        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const btn = document.getElementById('accept-cookies');
            if (!localStorage.getItem('cookiesAccepted') && banner) {
                setTimeout(() => {
                    banner.style.display = 'flex';
                    // Accessibility: Focus management
                    btn.focus();
                }, 2000);
            }
            if (btn) {
                btn.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    banner.style.display = 'none';
                });
            }
        },
        
        highlightCurrentPage() {
            const filename = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.mobile-nav-link, .dept-card, .dash-link').forEach(link => {
                if (link.getAttribute('href') === filename) {
                    link.style.fontWeight = 'bold';
                    if (link.classList.contains('mobile-nav-link')) link.style.borderLeft = '4px solid currentColor';
                }
            });
        },
        
        initCopyright() {
            const el = document.getElementById('year');
            if (el) el.textContent = new Date().getFullYear();
        },
        
        initFilterChips() {
            const container = document.querySelector('.filter-bar');
            if (!container) return;
            container.addEventListener('click', (e) => {
                const chip = e.target.closest('.chip');
                if (chip) {
                    container.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
                    chip.classList.add('is-active');
                }
            });
        }
    },
    
    /* --- COMMERCE & FORMS MODULE --- */
    Commerce: {
        initCheckoutFormatting() {
            const card = document.getElementById('card');
            const expiry = document.getElementById('expiry');
            const cvc = document.getElementById('cvc');
            
            if (card) card.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                e.target.value = val.match(/.{1,4}/g)?.join(' ') || val;
            });
            if (expiry) expiry.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
                e.target.value = val;
            });
            if (cvc) cvc.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4));
        },
        
        initFormValidation() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    let isValid = true;
                    form.querySelectorAll('.input[required]').forEach(input => {
                        if (!input.checkValidity()) {
                            input.classList.add('input--error');
                            isValid = false;
                        }
                    });
                    
                    if (!isValid) e.preventDefault();
                    else {
                        e.preventDefault();
                        const btn = form.querySelector('button[type="submit"]');
                        if (btn) {
                            // Accessibility: Aria-Live Notification
                            btn.setAttribute('aria-live', 'polite');
                            btn.textContent = "Processing Securely...";
                            btn.disabled = true;
                            btn.style.opacity = "0.7";
                            
                            // Form Field Reset: Clear sensitive data before navigation
                            setTimeout(() => {
                                form.reset();
                                window.location.href = form.getAttribute('action') || 'success.html';
                            }, 1800);
                        }
                    }
                });
            });
        }
    },
    
    /* --- UTILITIES MODULE --- */
    Utils: {
        initCodeCopy() {
            document.addEventListener('click', async (e) => {
                const btn = e.target.closest('.code-preview__copy');
                if (!btn) return;
                const code = btn.closest('.code-preview').querySelector('code').textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    const oldHtml = btn.innerHTML;
                    // Accessibility: Aria-Live
                    btn.setAttribute('aria-live', 'polite');
                    btn.innerHTML = 'Copied!';
                    setTimeout(() => btn.innerHTML = oldHtml, 2000);
                } catch (err) { console.error(err); }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => KynarApp.init());