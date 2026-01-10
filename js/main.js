/* js/main.js - KYNAR UNIVERSE CORE V2.5 (Physics & Handshake Sync) */
const KynarApp = {
    async init() {
        await this.Layout.loadShell();
        
        // UI Core
        requestAnimationFrame(() => this.UI.updateHeaderHeight()); 
        window.addEventListener('resize', () => this.UI.updateHeaderHeight());
        this.UI.initMobileMenu(); 
        this.UI.initThemeToggle(); 
        this.UI.initFilterChips();
        this.UI.initCopyright(); 
        this.UI.initCookieBanner(); 
        this.UI.highlightCurrentPage();
        this.Commerce.initLemonSqueezy();
        
        // Utils
        this.Utils.initCodeCopy(); 
        this.Utils.initSearch();
        
        // Dynamic Modules
        this.Utils.handleRecentProducts();
        this.Utils.handleRelatedProducts();
        this.Utils.handleNewsletter();
        this.Utils.handleFilters();

        // KINETIC VITRO PHYSICS
        this.Utils.initKineticVitro(); 
        this.Utils.initImagePulse();   

        // PWA: Service Worker Registration & Secure Handshake
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(() => {
                    console.log('Vitro Service Worker: Active');
                    this.Utils.checkSecureStatus();
                })
                .catch(err => console.warn('SW Failed', err));
        }
    },

    Layout: {
        async loadShell() {
            try {
                const [n, f] = await Promise.all([
                    fetch('nav-content.html').then(r => r.text()),
                    fetch('footer-content.html').then(r => r.text())
                ]);
                if (document.getElementById('mobile-menu')) document.getElementById('mobile-menu').innerHTML = n;
                if (document.getElementById('global-footer')) document.getElementById('global-footer').innerHTML = f;
            } catch (e) { console.warn("Shell failed", e); }
        }
    },

    UI: {
        updateHeaderHeight() {
            const h = document.getElementById('global-header');
            if (h) document.documentElement.style.setProperty('--header-height', h.offsetHeight + 'px');
        },
        initMobileMenu() {
            const btns = Array.from(document.querySelectorAll('.menu-toggle')).filter(b => b.id !== 'theme-toggle');
            const menu = document.getElementById('mobile-menu');
            if (!btns.length || !menu) return;

            const close = () => {
                menu.classList.remove('is-active');
                document.body.classList.remove('is-scroll-locked');
                btns.forEach(b => b.setAttribute('aria-expanded', 'false'));
            };
            const open = () => {
                menu.classList.add('is-active');
                document.body.classList.add('is-scroll-locked');
                btns.forEach(b => b.setAttribute('aria-expanded', 'true'));
                history.pushState({ menuOpen: true }, '');
            };
            btns.forEach(b => b.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                menu.classList.contains('is-active') ? history.back() : open();
            }));
            window.addEventListener('popstate', () => { if (menu.classList.contains('is-active')) close(); });
            menu.addEventListener('click', (e) => { if (e.target === menu) history.back(); });
            menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => close()));
        },
        
        // FIXED: Now defaults to Light Mode (no attribute) unless Dark is saved
        initThemeToggle() {
            const btn = document.getElementById('theme-toggle');
            const html = document.documentElement;
            
            // Check for saved dark preference
            if (localStorage.getItem('theme') === 'dark') {
                html.setAttribute('data-theme', 'dark');
            }

            if (btn) {
                btn.addEventListener('click', () => {
                    const isDark = html.getAttribute('data-theme') === 'dark';
                    if (isDark) {
                        html.removeAttribute('data-theme');
                        localStorage.setItem('theme', 'light');
                    } else {
                        html.setAttribute('data-theme', 'dark');
                        localStorage.setItem('theme', 'dark');
                    }
                });
            }
        },

        initCookieBanner() {
            const b = document.getElementById('cookie-banner'), btn = document.getElementById('accept-cookies');
            if (b) b.setAttribute('role', 'status'); 
            if (!localStorage.getItem('cookiesAccepted') && b) {
                setTimeout(() => { b.style.display = 'flex'; requestAnimationFrame(() => { b.classList.add('is-visible'); if (btn) btn.focus(); }); }, 2000);
            }
            if (btn) btn.addEventListener('click', () => { localStorage.setItem('cookiesAccepted', 'true'); b.classList.remove('is-visible'); setTimeout(() => b.style.display = 'none', 500); });
        },
        highlightCurrentPage() {
            const file = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.mobile-nav-link, .dept-card, .dash-link').forEach(l => {
                if (l.getAttribute('href') === file) { 
                    l.style.fontWeight = 'bold'; 
                    if (l.classList.contains('mobile-nav-link')) l.style.borderLeft = '4px solid currentColor'; 
                }
            });
        },
        initCopyright() { if (document.getElementById('year')) document.getElementById('year').textContent = new Date().getFullYear(); },
        initFilterChips() {
            const bar = document.querySelector('.filter-bar');
            if (bar) bar.addEventListener('click', (e) => { 
                const c = e.target.closest('.chip'); 
                if (c) { 
                    bar.querySelectorAll('.chip').forEach(x => x.classList.remove('is-active')); 
                    c.classList.add('is-active'); 
                } 
            });
        }
    },

    Commerce: {
        initLemonSqueezy() {
            if (!document.querySelector('script[src*="lemon.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://assets.lemonsqueezy.com/lemon.js';
                script.defer = true;
                document.head.appendChild(script);
            }
        }
    },

    Utils: {
        async loadSearchIndex() {
            if (window.KynarSearchIndex) return; 
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'js/search-index.js';
                script.onload = resolve;
                document.body.appendChild(script);
            });
        },

        initCodeCopy() {
            document.addEventListener('click', async (e) => {
                const b = e.target.closest('.code-preview__copy'); if (!b) return;
                const c = b.closest('.code-preview').querySelector('code').textContent;
                try { 
                    await navigator.clipboard.writeText(c); 
                    const old = b.innerHTML; 
                    b.setAttribute('aria-live', 'polite'); 
                    b.innerHTML = 'Copied!'; 
                    setTimeout(() => { b.innerHTML = old; b.removeAttribute('aria-live'); }, 2000); 
                } catch (err) { console.error('Copy failed', err); }
            });
        },

        initSearch() {
            const input = document.querySelector('.search-input');
            const wrapper = document.querySelector('.search-input-wrapper');
            if (!input || !wrapper) return;
            
            let resultsBox = document.createElement('div');
            resultsBox.className = 'search-results'; resultsBox.hidden = true;
            wrapper.appendChild(resultsBox);
            
            document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) resultsBox.hidden = true; });
            
            input.addEventListener('input', async (e) => {
                const term = e.target.value.toLowerCase().trim();
                resultsBox.innerHTML = '';
                if (term.length < 2) { resultsBox.hidden = true; return; }
                
                await KynarApp.Utils.loadSearchIndex();
                
                if (typeof KynarSearchIndex === 'undefined') return;
                const matches = KynarSearchIndex.filter(item => item.title.toLowerCase().includes(term) || item.tags.includes(term)).slice(0, 5);
                
                if (matches.length > 0) {
                    resultsBox.hidden = false;
                    matches.forEach(match => {
                        const row = document.createElement('a');
                        row.href = match.url; row.className = 'search-result-row';
                        row.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                                <img src="${match.image}" alt="" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover; background: var(--color-surface-dark);">
                                <div style="flex: 1;">
                                    <div class="search-result-title">${match.title}</div>
                                    <div class="search-result-meta">${match.category}</div>
                                </div>
                                <div class="search-result-price">${match.price}</div>
                            </div>`;
                        resultsBox.appendChild(row);
                    });
                } else { 
                    resultsBox.hidden = false; 
                    resultsBox.innerHTML = `<div class="search-result-empty">No results found for "${term}"</div>`; 
                }
            });
        },

        initImagePulse() {
            if (!document.getElementById('vitro-pulse-style')) {
                const style = document.createElement('style');
                style.id = 'vitro-pulse-style';
                style.textContent = `@keyframes vitroPulse { 0% { background-color: var(--color-surface-dark); opacity: 0.5; } 50% { background-color: var(--glow-color, var(--color-tech)); opacity: 0.15; } 100% { background-color: var(--color-surface-dark); opacity: 0.5; } } .vitro-loading { animation: vitroPulse 2s infinite ease-in-out; }`;
                document.head.appendChild(style);
            }
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) return;
                const wrapper = img.closest('.product-card__image-wrapper') || img.parentElement;
                const card = img.closest('.product-card, .dept-card');
                if (card && wrapper) {
                    const glow = card.style.getPropertyValue('--glow-color') || 'var(--color-tech)';
                    wrapper.style.setProperty('--glow-color', glow);
                    wrapper.classList.add('vitro-loading');
                }
                const removeLoader = () => { if(wrapper) wrapper.classList.remove('vitro-loading'); };
                img.addEventListener('load', removeLoader);
                img.addEventListener('error', removeLoader);
            });
        },

        initKineticVitro() {
            const blobs = document.querySelectorAll('.vitro-blob');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!blobs.length || prefersReducedMotion) return;
            let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
            const ease = 0.05;
            let animationFrameId, isRunning = false;
            window.addEventListener('mousemove', (e) => {
                targetX = (e.clientX / window.innerWidth) - 0.5;
                targetY = (e.clientY / window.innerHeight) - 0.5;
            });
            const animate = () => {
                const deltaX = (targetX - currentX) * ease;
                const deltaY = (targetY - currentY) * ease;
                currentX += deltaX; currentY += deltaY;
                if (Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001) {
                    blobs.forEach((blob, i) => {
                        const depth = (i + 1) * 30; 
                        blob.style.transform = `translate3d(${currentX * depth * -1}px, ${currentY * depth * -1}px, 0)`;
                    });
                }
                if (isRunning) animationFrameId = requestAnimationFrame(animate);
            };
            const startEngine = () => { if (!isRunning) { isRunning = true; animate(); } };
            const stopEngine = () => { isRunning = false; if (animationFrameId) cancelAnimationFrame(animationFrameId); };
            document.addEventListener('visibilitychange', () => { document.hidden ? stopEngine() : startEngine(); });
            startEngine();
        },

        handleRecentProducts() {
            const STORAGE_KEY = 'kynar_recent';
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            if (document.querySelector('.pdp-layout')) {
                const titleEl = document.querySelector('h1');
                const imgEl = document.querySelector('.gallery-item img');
                const priceEl = document.querySelector('.price-display-xl') || document.querySelector('.price-display-lg'); 
                if (titleEl && imgEl) {
                    const product = { url: currentPath, title: titleEl.textContent, image: imgEl.getAttribute('src'), price: priceEl ? priceEl.textContent.trim() : 'View', timestamp: Date.now() };
                    let recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                    recent = recent.filter(p => p.url !== currentPath); 
                    recent.unshift(product); 
                    recent = recent.slice(0, 4); 
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
                }
            }
            const container = document.getElementById('recently-viewed-container');
            if (container) {
                const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                const toShow = recent.filter(p => p.url !== currentPath).slice(0, 3);
                if (toShow.length === 0) { container.style.display = 'none'; return; }
                const grid = container.querySelector('.product-grid');
                if (grid) {
                    grid.innerHTML = toShow.map(p => {
                        let glowColor = 'var(--color-tech)';
                        if (p.url.includes('life')) glowColor = 'var(--color-life)';
                        if (p.url.includes('family')) glowColor = 'var(--color-family)';
                        return `<article class="product-card" style="--glow-color: ${glowColor}"><a href="${p.url}" style="text-decoration: none; display: contents; color: inherit;"><div class="product-card__image-wrapper"><img src="${p.image}" alt="${p.title}" class="product-card__image"></div><div class="product-card__content"><h3 class="product-card__title">${p.title}</h3><div class="product-card__footer"><span class="product-card__price">${p.price}</span><span class="btn btn--secondary" style="padding:0 var(--space-2); min-height:32px; font-size:var(--text-xs);">View</span></div></div></a></article>`;
                    }).join('');
                }
            }
        },

        handleRelatedProducts() {
            const container = document.getElementById('related-products-grid');
            if (!container || typeof KynarSearchIndex === 'undefined') return;
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const currentTitle = document.querySelector('h1')?.textContent || '';
            let category = 'Tech'; 
            if (document.body.innerHTML.includes('KYNAR Life')) category = 'Life';
            if (document.body.innerHTML.includes('KYNAR Family')) category = 'Family';
            const candidates = KynarSearchIndex.filter(p => p.category === category && !p.url.includes(currentPath) && p.title !== currentTitle);
            const shuffled = candidates.sort(() => 0.5 - Math.random()).slice(0, 2); 
            if (shuffled.length > 0) {
                container.innerHTML = shuffled.map(p => {
                    let glowColor = 'var(--color-tech)';
                    if (p.category === 'Life') glowColor = 'var(--color-life)';
                    if (p.category === 'Family') glowColor = 'var(--color-family)';
                    return `<article class="product-card" style="--glow-color: ${glowColor}"><a href="${p.url}" style="text-decoration: none; display: contents; color: inherit;"><div class="product-card__image-wrapper"><img src="${p.image}" alt="${p.title}" class="product-card__image"></div><div class="product-card__content"><h3 class="product-card__title">${p.title}</h3><div class="product-card__footer"><span class="product-card__price">${p.price}</span><span class="btn btn--secondary" style="padding:0 var(--space-2); min-height:32px; font-size:var(--text-xs);">View</span></div></div></a></article>`;
                }).join('');
            } else { const section = container.closest('section'); if(section) section.style.display = 'none'; }
        },

        handleNewsletter() {
            const toast = document.getElementById('newsletter-toast');
            const form = document.getElementById('newsletter-form');
            const status = document.getElementById('newsletter-status');
            const STORAGE_KEY = 'kynar_newsletter_seen';

            if (!toast || sessionStorage.getItem(STORAGE_KEY)) return;

            setTimeout(() => {
                toast.classList.add('is-visible');
                sessionStorage.setItem(STORAGE_KEY, 'true');
            }, 4000);

            document.getElementById('newsletter-close')?.addEventListener('click', () => {
                toast.classList.remove('is-visible');
            });

            form?.addEventListener('submit', async (e) => {
                e.preventDefault();
                const MAILERLITE_URL = 'https://assets.mailerlite.com/jsonp/2029228/forms/176215388525168382/subscribe';

                if (status) {
                    status.style.display = 'block';
                    status.style.color = 'var(--color-tech)';
                    status.textContent = 'TRANSMITTING...';
                }

                try {
                    await fetch(MAILERLITE_URL, {
                        method: 'POST',
                        body: new FormData(form),
                        mode: 'no-cors'
                    });

                    if (status) {
                        status.style.color = '#00ff88';
                        status.textContent = 'SYSTEM_SYNC_COMPLETE';
                    }
                    setTimeout(() => toast.classList.remove('is-visible'), 2000);
                } catch (err) {
                    if (status) {
                        status.style.color = 'var(--color-error)';
                        status.textContent = 'SYNC_FAILED_RETRY';
                    }
                }
            });
        },

        handleFilters() {
            const filterBtn = document.getElementById('apply-filters');
            if (!filterBtn) return;

            filterBtn.addEventListener('click', () => {
                const activeFilters = Array.from(document.querySelectorAll('.sidebar-filters input[type="checkbox"]:checked'))
                    .map(cb => cb.parentElement.textContent.trim().toLowerCase());

                const products = document.querySelectorAll('.product-card');

                products.forEach(card => {
                    const badges = Array.from(card.querySelectorAll('.badge'))
                        .map(b => b.textContent.trim().toLowerCase());

                    if (activeFilters.length === 0) {
                        card.style.display = '';
                    } else {
                        const hasMatch = activeFilters.some(filter => badges.includes(filter));
                        card.style.display = hasMatch ? '' : 'none';
                    }
                });
            });
        },

        checkSecureStatus() {
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status-text');
            if (!navigator.serviceWorker.controller || !statusDot) return;

            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data && event.data.status === 'SECURE_CONNECTION_ACTIVE') {
                    statusDot.classList.add('is-secure');
                    if (statusText) statusText.textContent = 'SECURE';
                }
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'CHECK_SECURE_STATUS' },
                [messageChannel.port2]
            );
        }
    }
};

document.addEventListener('DOMContentLoaded', () => KynarApp.init());
