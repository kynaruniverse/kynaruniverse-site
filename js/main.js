/* js/main.js - KYNAR UNIVERSE CORE V3.2 (Sector Logic & Glass Physics) */

const KynarApp = {
    async init() {
        // 1. CRITICAL: Load Shell Components First
        await this.Layout.loadShell();
        
        // 2. UI CORE
        this.UI.initHeaderTracking();
        this.UI.initMobileMenu(); 
        this.UI.initThemeToggle(); 
        this.UI.initCookieBanner(); 
        this.UI.highlightCurrentPage();
        
        // 3. UTILS & DYNAMIC MODULES
        this.Commerce.initLemonSqueezy();
        this.Utils.initSearch();
        this.Utils.handleRecentProducts();
        this.Utils.handleNewsletter();
        this.Utils.loadProductTemplate(); 
        this.Utils.initKineticVitro(); 

        // 4. PWA & SECURE HANDSHAKE
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(() => {
                    console.log('SYS_STATUS: SECURE_LINK_ESTABLISHED');
                    this.Utils.checkSecureStatus();
                })
                .catch(err => console.warn('SYS_STATUS: OFFLINE_MODE', err));
        }
    },

    Layout: {
        async loadShell() {
            try {
                // Fetch shared nav/footer if they exist
                const [navHtml, footerHtml] = await Promise.all([
                    fetch('nav-content.html').then(r => r.ok ? r.text() : null),
                    fetch('footer-content.html').then(r => r.ok ? r.text() : null)
                ]);
                
                const menuContainer = document.getElementById('mobile-menu');
                const footerContainer = document.getElementById('global-footer');
                
                if (menuContainer && navHtml) menuContainer.innerHTML = navHtml;
                if (footerContainer && footerHtml) footerContainer.innerHTML = footerHtml;
                
                // Re-run UI init after injection
                if (navHtml) KynarApp.UI.highlightCurrentPage();
                
                return true;
            } catch (e) { 
                console.warn("Layout injection skipped (local dev or missing files)"); 
                return false;
            }
        }
    },

    UI: {
        initHeaderTracking() {
            const h = document.getElementById('global-header');
            if (!h) return;
            
            const update = () => {
                const height = h.offsetHeight;
                document.documentElement.style.setProperty('--header-height', height + 'px');
            };
            
            const ro = new ResizeObserver(update);
            ro.observe(h);
            update(); // Run immediately
        },

        initMobileMenu() {
            const btns = document.querySelectorAll('.menu-toggle:not(#theme-toggle)');
            const menu = document.getElementById('mobile-menu');
            if (!btns.length || !menu) return;

            const toggleMenu = (forceState) => {
                const isActive = menu.classList.contains('is-active');
                const newState = forceState !== undefined ? forceState : !isActive;

                if (newState) {
                    menu.classList.add('is-active');
                    document.body.style.overflow = 'hidden'; // Lock scroll
                    btns.forEach(b => b.setAttribute('aria-expanded', 'true'));
                } else {
                    menu.classList.remove('is-active');
                    document.body.style.overflow = ''; // Unlock scroll
                    btns.forEach(b => b.setAttribute('aria-expanded', 'false'));
                }
            };

            // Toggle Click
            btns.forEach(b => b.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                toggleMenu(); 
            }));

            // Close on Link Click
            menu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target === menu) {
                    toggleMenu(false);
                }
            });
        },
        
        initThemeToggle() {
            const toggles = document.querySelectorAll('#theme-toggle');
            const html = document.documentElement;
            
            // 1. Check Storage or System Preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.setAttribute('data-theme', 'dark');
            }

            // 2. Bind Click
            toggles.forEach(btn => {
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
            });
        },

        initCookieBanner() {
            const b = document.getElementById('cookie-banner');
            const btn = document.getElementById('accept-cookies');
            if (!b || localStorage.getItem('cookiesAccepted')) return;
            
            setTimeout(() => {
                b.classList.add('is-visible'); // Use CSS transition class
                b.style.display = 'flex';
            }, 2000);

            btn?.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                b.classList.remove('is-visible');
                setTimeout(() => b.style.display = 'none', 500);
            });
        },

        highlightCurrentPage() {
            const path = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('a').forEach(l => {
                const href = l.getAttribute('href');
                if (href === path) { 
                    l.classList.add('is-active');
                    // Special styling handled in CSS via .is-active
                }
            });
        }
    },

    Commerce: {
        initLemonSqueezy() {
            if (window.createLemonSqueezy) return;
            const script = document.createElement('script');
            script.src = 'https://assets.lemonsqueezy.com/lemon.js';
            script.defer = true;
            document.head.appendChild(script);
        }
    },

    Utils: {
        async loadSearchIndex() {
            if (window.KynarSearchIndex) return; 
            return new Promise((res) => {
                const s = document.createElement('script');
                s.src = 'js/search-index.js';
                s.onload = res;
                s.onerror = res; // Proceed even if fails
                document.body.appendChild(s);
            });
        },

        initSearch() {
            const input = document.querySelector('.search-input');
            const wrapper = document.querySelector('.search-input-wrapper');
            if (!input || !wrapper) return;
            
            // Create Dropdown if missing
            let resultsBox = wrapper.querySelector('.search-results');
            if (!resultsBox) {
                resultsBox = document.createElement('div');
                resultsBox.className = 'search-results'; 
                resultsBox.hidden = true;
                wrapper.appendChild(resultsBox);
            }
            
            // Close on click outside
            document.addEventListener('click', (e) => { 
                if (!wrapper.contains(e.target)) resultsBox.hidden = true; 
            });
            
            input.addEventListener('input', async (e) => {
                const term = e.target.value.toLowerCase().trim();
                if (term.length < 2) { resultsBox.hidden = true; return; }
                
                await KynarApp.Utils.loadSearchIndex();
                if (!window.KynarSearchIndex) return;

                const matches = KynarSearchIndex.filter(i => 
                    i.title.toLowerCase().includes(term) || 
                    (i.tags && i.tags.toLowerCase().includes(term))
                ).slice(0, 5);
                
                resultsBox.hidden = false;
                
                if (matches.length > 0) {
                    resultsBox.innerHTML = matches.map(m => `
                        <a href="${m.url}" class="search-result-row">
                            <div style="flex: 1;">
                                <div class="search-result-title">${m.title}</div>
                                <div class="search-result-meta">${m.category || 'PRODUCT'}</div>
                            </div>
                            <div class="search-result-price">${m.price}</div>
                        </a>
                    `).join('');
                } else { 
                    resultsBox.innerHTML = `<div class="search-result-empty">NO_MATCHES_FOUND</div>`; 
                }
            });
        },

        initKineticVitro() {
            // SUPREMACY PHYSICS: MAGNETIC INERTIA V2.0
            const blobs = document.querySelectorAll('.vitro-blob');
            if (!blobs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            let targetX = 0, targetY = 0;
            let currentX = 0, currentY = 0;

            window.addEventListener('mousemove', (e) => {
                // Normalizing coordinates to center (-1 to 1)
                targetX = (e.clientX / window.innerWidth) * 2 - 1;
                targetY = (e.clientY / window.innerHeight) * 2 - 1;
            });

            const animate = () => {
                // Linear Interpolation (Lerp) for "Heavy" Fluid Feel
                currentX += (targetX - currentX) * 0.05; 
                currentY += (targetY - currentY) * 0.05;

                blobs.forEach((b, i) => {
                    const depth = (i + 1) * 35; // Increased depth
                    const rotate = currentX * (i % 2 === 0 ? 10 : -10); // Slight rotation
                    
                    const x = currentX * depth;
                    const y = currentY * depth;
                    
                    b.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
                });
                requestAnimationFrame(animate);
            };
            animate();
        },


        handleRecentProducts() {
            // Simplified for performance
            const KEY = 'kynar_recent';
            const container = document.getElementById('recently-viewed-container');
            if (!container) return;

            // 1. Record View (if on PDP)
            const isPDP = !!document.getElementById('pdp-title');
            if (isPDP) {
                const title = document.getElementById('pdp-title')?.textContent;
                const img = document.getElementById('pdp-main-image')?.src;
                const price = document.getElementById('pdp-price')?.textContent;
                
                if (title && img) {
                    let recent = JSON.parse(localStorage.getItem(KEY) || '[]');
                    // Remove duplicate if exists
                    recent = recent.filter(p => p.url !== window.location.search);
                    // Add new to top
                    recent.unshift({ 
                        url: window.location.search, 
                        title, 
                        image: img, 
                        price: price || 'View'
                    });
                    localStorage.setItem(KEY, JSON.stringify(recent.slice(0, 4)));
                }
            }

            // 2. Render List (exclude current page)
            const recent = JSON.parse(localStorage.getItem(KEY) || '[]');
            const toShow = recent.filter(p => p.url !== window.location.search).slice(0, 3);
            
            if (toShow.length > 0) {
                container.style.display = 'block';
                const grid = container.querySelector('.product-grid');
                if (grid) {
                    grid.innerHTML = toShow.map(p => `
                        <article class="product-card">
                            <a href="product.html${p.url}" class="dept-link">
                                <div class="product-card__image-wrapper">
                                    <img src="${p.image}" class="product-card__image" alt="${p.title}">
                                </div>
                                <div class="product-card__content">
                                    <h3 class="product-card__title">${p.title}</h3>
                                    <div class="product-card__footer">
                                        <span class="product-card__price">${p.price}</span>
                                    </div>
                                </div>
                            </a>
                        </article>
                    `).join('');
                }
            }
        },
        
        handleNewsletter() {
            const toast = document.getElementById('newsletter-toast');
            if (!toast || sessionStorage.getItem('kynar_newsletter_seen')) return;
            
            // Show after delay
            setTimeout(() => {
                toast.classList.add('is-visible');
                sessionStorage.setItem('kynar_newsletter_seen', 'true');
            }, 8000); // 8 seconds delay

            document.getElementById('newsletter-close')?.addEventListener('click', () => {
                toast.classList.remove('is-visible');
            });
        },

        checkSecureStatus() {
            const dot = document.querySelector('.status-dot');
            if (dot) dot.classList.add('is-secure');
        },

        loadProductTemplate() {
            // Dynamic PDP Loader based on URL params (?id=xxx)
            // Requires js/products.js (Database)
            if (!document.getElementById('pdp-title') || typeof KynarDatabase === 'undefined') return;

            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            const product = KynarDatabase[id];

            if (!product) return; // Stay on skeleton or 404

            // Update DOM Elements
            const setText = (id, txt) => { 
                const el = document.getElementById(id); 
                if (el && txt) el.textContent = txt; 
            };
            
            document.title = `${product.title} | KYNAR UNIVERSE`;
            setText('pdp-title', product.title);
            setText('pdp-desc', product.description);
            setText('pdp-price', product.price);
            
            const img = document.getElementById('pdp-main-image');
            if (img) img.src = product.image;

            const btn = document.getElementById('pdp-buy-btn');
            if (btn) btn.href = product.lsLink + '?embed=1';
            
            // Update Sector Color
            const blob = document.getElementById('pdp-bg-blob');
            if (blob && product.category) {
                const sectorColor = `var(--color-${product.category.toLowerCase()})`;
                blob.style.background = sectorColor;
                document.body.setAttribute('data-sector', product.category.toLowerCase());
            }
        }
    }
};

// Start System
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KynarApp.init());
} else {
    KynarApp.init();
}
