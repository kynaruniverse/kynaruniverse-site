/* js/main.js - KYNAR UNIVERSE CORE V1.12 (Final Production) */
const KynarApp = {
 async init() {
  await this.Layout.loadShell();
  this.UI.updateHeaderHeight(); // Phase 8
  window.addEventListener('resize', () => this.UI.updateHeaderHeight());
  this.UI.initMobileMenu(); this.UI.initThemeToggle(); this.UI.initFilterChips();
  this.UI.initCopyright(); this.UI.initCookieBanner(); this.UI.highlightCurrentPage();
  this.Commerce.initCheckoutFormatting(); this.Commerce.initFormValidation();
  this.Utils.initCodeCopy(); this.Utils.initSearch(); // Phase 8
 },
 Layout: {
  async loadShell() {
   try {
    const [h, n, f] = await Promise.all([
     fetch('header-content.html').then(r => r.text()),
     fetch('nav-content.html').then(r => r.text()),
     fetch('footer-content.html').then(r => r.text())
    ]);
    if (document.getElementById('global-header')) document.getElementById('global-header').innerHTML = h;
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
   const toggle = (close = false) => {
    const active = menu.classList.contains('is-active');
    if (close && !active) return;
    menu.classList.toggle('is-active', !close ? !active : false);
    const now = menu.classList.contains('is-active');
    document.body.classList.toggle('is-scroll-locked', now); // Phase 7
    btns.forEach(b => b.setAttribute('aria-expanded', now));
    if (now && menu.querySelector('a')) menu.querySelector('a').focus();
   };
   btns.forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); toggle(); }));
   menu.addEventListener('click', (e) => { if (e.target === menu) toggle(true); });
   menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => toggle(true)));
  },
  initThemeToggle() {
   const btn = document.getElementById('theme-toggle'), html = document.documentElement;
   if (localStorage.getItem('theme') === 'dark') html.setAttribute('data-theme', 'dark');
   if (btn) btn.addEventListener('click', () => {
    const dark = html.getAttribute('data-theme') === 'dark';
    html.toggleAttribute('data-theme', !dark);
    localStorage.setItem('theme', !dark ? 'dark' : 'light');
   });
  },
  initCookieBanner() {
   const b = document.getElementById('cookie-banner'), btn = document.getElementById('accept-cookies');
   if (b) b.setAttribute('role', 'status'); // Phase 7
   if (!localStorage.getItem('cookiesAccepted') && b) {
    setTimeout(() => { b.style.display = 'flex'; requestAnimationFrame(() => { b.classList.add('is-visible'); if (btn) btn.focus(); }); }, 2000);
   }
   if (btn) btn.addEventListener('click', () => { localStorage.setItem('cookiesAccepted', 'true'); b.classList.remove('is-visible'); setTimeout(() => b.style.display = 'none', 500); });
  },
  highlightCurrentPage() {
   const file = window.location.pathname.split('/').pop() || 'index.html';
   document.querySelectorAll('.mobile-nav-link, .dept-card, .dash-link').forEach(l => {
    if (l.getAttribute('href') === file) { l.style.fontWeight = 'bold'; if (l.classList.contains('mobile-nav-link')) l.style.borderLeft = '4px solid currentColor'; }
   });
  },
  initCopyright() { if (document.getElementById('year')) document.getElementById('year').textContent = new Date().getFullYear(); },
  initFilterChips() {
   const bar = document.querySelector('.filter-bar');
   if (bar) bar.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) { bar.querySelectorAll('.chip').forEach(x => x.classList.remove('is-active')); c.classList.add('is-active'); } });
  }
 },
 Commerce: {
  initCheckoutFormatting() {
   const c = document.getElementById('card'), e = document.getElementById('expiry'), v = document.getElementById('cvc');
   if (c) c.addEventListener('input', (x) => { let val = x.target.value.replace(/\D/g, '').substring(0, 16); x.target.value = val.match(/.{1,4}/g)?.join(' ') || val; });
   if (e) e.addEventListener('input', (x) => { let val = x.target.value.replace(/\D/g, '').substring(0, 4); if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2); x.target.value = val; });
   if (v) v.addEventListener('input', (x) => x.target.value = x.target.value.replace(/\D/g, '').substring(0, 4));
  },
  initFormValidation() {
   document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('.input').forEach(i => i.addEventListener('input', () => i.classList.remove('input--error')));
    form.addEventListener('submit', (e) => {
     let valid = true, firstErr = null;
     form.querySelectorAll('.input[required]').forEach(i => { if (!i.checkValidity()) { i.classList.add('input--error'); valid = false; if (!firstErr) firstErr = i; } });
     if (!valid) { 
      e.preventDefault(); const s = document.getElementById('form-error-summary'); 
      if (s) s.textContent = "Please correct errors."; 
      if (firstErr) { firstErr.focus(); firstErr.scrollIntoView({ behavior: 'smooth', block: 'start' }); } // Phase 7
     } else {
      e.preventDefault(); const btn = form.querySelector('button[type="submit"]'), ov = document.createElement('div');
      ov.className = 'transaction-overlay';
      ov.innerHTML = `<div class="spinner"></div><p id="tx-status" style="font-family:var(--font-heading);letter-spacing:1px;">SECURE HANDSHAKE...</p><p id="tx-sub" style="font-size:var(--text-sm);opacity:0.8;">Verifying with KYNAR Vault</p>`;
      document.body.appendChild(ov); const st = ov.querySelector('#tx-status'), sb = ov.querySelector('#tx-sub');
      setTimeout(() => { ov.classList.add('is-active'); document.body.classList.add('is-scroll-locked'); }, 10);
      if (btn) { btn.setAttribute('aria-live', 'polite'); btn.textContent = "Processing..."; btn.disabled = true; }
      setTimeout(() => { if(st) st.textContent="AUTHORIZING..."; if(sb) sb.textContent="Syncing keys"; }, 800); // Phase 8
      setTimeout(() => { if(st) { st.textContent="SUCCESS"; st.style.color="var(--color-emerald)"; } if(sb) sb.textContent="Redirecting..."; }, 1500); // Phase 8
      setTimeout(() => { form.reset(); document.body.classList.remove('is-scroll-locked'); window.location.href = form.getAttribute('action') || 'success.html'; }, 2200);
     }
    });
   });
  }
 },
 Utils: {
  initCodeCopy() {
   document.addEventListener('click', async (e) => {
    const b = e.target.closest('.code-preview__copy'); if (!b) return;
    const c = b.closest('.code-preview').querySelector('code').textContent;
    try { await navigator.clipboard.writeText(c); const old = b.innerHTML; b.setAttribute('aria-live', 'polite'); b.innerHTML = 'Copied!'; setTimeout(() => { b.innerHTML = old; b.removeAttribute('aria-live'); }, 2000); } catch (err) { console.error('Copy failed', err); }
   });
  },
  initSearch() { // Phase 8
   const i = document.querySelector('.search-input'), s = document.getElementById('search-status');
   if (i) i.addEventListener('input', (e) => {
    const t = e.target.value.toLowerCase(), cards = document.querySelectorAll('.product-card'); let count = 0;
    cards.forEach(c => { const match = c.querySelector('.product-card__title').textContent.toLowerCase().includes(t); c.style.display = match ? '' : 'none'; if (match) count++; });
    if (s && t) s.textContent = `${count} products found for ${t}`;
   });
  }
 }
};
document.addEventListener('DOMContentLoaded', () => KynarApp.init());
