/* js/main.js */
/**
 * KYNAR UNIVERSE - MODULAR CORE
 * Version: 1.5 (Global Layout Injection Engine)
 */

const KynarApp = {
    // We make init async so it can wait for the layout to load
    async init() {
        // 1. Load the shell first
        await this.Layout.loadShell();
        
        // 2. Initialize UI components (now that they exist in the DOM)
        this.UI.initMobileMenu();
        this.UI.initThemeToggle();
        this.UI.initFilterChips();
        this.UI.initCopyright();
        this.UI.initCookieBanner();
        this.UI.highlightCurrentPage();
        
        // 3. Initialize Commerce & Utils
        this.Commerce.initCheckoutFormatting();
        this.Commerce.initFormValidation();
        this.Utils.initCodeCopy();
    },

    /* --- LAYOUT INJECTION MODULE --- */
    Layout: {
        async loadShell() {
            try {
                // Perform all fetches simultaneously
                const [header, nav, footer] = await Promise.all([
                    fetch('header-content.html').then(res => res.text()),
                    fetch('nav-content.html').then(res => res.text()),
                    fetch('footer-content.html').then(res => res.text())
                ]);

                // Targeted Injection with Safety Checks
                const headerEl = document.getElementById('global-header');
                const navEl = document.getElementById('mobile-menu');
                const footerEl = document.getElementById('global-footer');

                if (headerEl) headerEl.innerHTML = header;
                if (navEl) navEl.innerHTML = nav;
                if (footerEl) footerEl.innerHTML = footer;

                console.log("KYNAR Shell: Injected Successfully.");
            } catch (err) {
                console.warn("KYNAR Shell: Some elements skipped or fetch failed.", err);
            }
        }
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
                
                if (nowActive) {
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            };
            
            menuToggles.forEach(btn => btn.addEventListener('click', (e) => { 
                e.stopPropagation();
                toggle(); 
            }));
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
                    if (btn) btn.focus();
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
                form.querySelectorAll('.input').forEach(input => {
                    input.addEventListener('input', () => {
                        input.classList.remove('input--error');
                    });
                });

                form.addEventListener('submit', (e) => {
                    let isValid = true;
                    form.querySelectorAll('.input[required]').forEach(input => {
                        if (!input.checkValidity()) {
                            input.classList.add('input--error');
                            isValid = false;
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                    } else {
                        e.preventDefault();
                        const btn = form.querySelector('button[type=\"submit\"]');
                        const overlay = document.createElement('div');
                        overlay.className = 'transaction-overlay';
                        overlay.innerHTML = `
                            <div class="spinner"></div>
                            <p style=\"font-family: var(--font-heading); letter-spacing: 1px;\">SECURE HANDSHAKE...</p>
                            <p style=\"font-size: var(--text-sm); opacity: 0.8;\">Verifying with KYNAR Vault</p>
                        `;
                        document.body.appendChild(overlay);
                        
                        setTimeout(() => overlay.classList.add('is-active'), 10);
                        
                        if (btn) {
                            btn.setAttribute('aria-live', 'polite');
                            btn.textContent ="Processing...";
                            btn.disabled = true;
                        }
                        
                        setTimeout(() => {
                            form.reset();
                            window.location.href = form.getAttribute('action') || 'success.html';
                        }, 1800);
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
                    btn.setAttribute('aria-live', 'polite');
                    btn.innerHTML = 'Copied!';
                    
                    setTimeout(() => {
                        btn.innerHTML = oldHtml;
                        btn.removeAttribute('aria-live');
                    }, 2000);
                } catch (err) { console.error('Copy failed', err); }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => KynarApp.init());
