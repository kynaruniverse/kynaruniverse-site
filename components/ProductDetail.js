/* ==========================================================================
   COMPONENT | PRODUCT DETAIL ENGINE
   ========================================================================== */
import { EventBus, EVENTS } from '../src/core/events.js';

export function renderProductDetail(p) {
  const isLocked = p.status === 'coming-soon';
  const btnLabel = isLocked ? 'Notify Me' : (p.actionLabel || 'Authorize Download');
  const featuresHtml = (p.features || []).map(f => `
    <li class="flex-row gap-md text-bold" style="font-size: 1rem;">
      <div style="background: var(--color-accent); border-radius: 50%; height: 6px; width: 6px;"></div>
      ${f}
    </li>
  `).join('');

  return `
    <div class="product-hero reveal-up">
      <div class="product-hero__img-col">
        <div class="product-hero__img-box" style="background: ${p.accentColor || 'var(--color-sage)'}">
          <img src="${p.image}" alt="${p.title}" class="product-hero-img">
        </div>
      </div>

      <div class="product-hero__content">
        <div class="flex-row gap-sm" style="margin-bottom: 20px;">
           <span style="background: var(--color-accent); height: 1px; width: 30px;"></span>
           <span class="text-accent text-upper text-bold text-xs" style="letter-spacing: 0.3em;">${p.tag}</span>
        </div>

        <h1 class="product-hero__title">${p.title}</h1>
        <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 40px; color: var(--color-text-muted);">
          ${p.longDesc || p.desc}
        </p>
        
        ${featuresHtml ? `
          <div style="border-top: 1px solid var(--color-border); padding-top: 32px; margin-bottom: 40px;">
            <h4 class="text-upper text-xs text-faded" style="margin-bottom: 24px; letter-spacing: 0.1em;">Included in Shop:</h4>
            <ul class="grid-col-1 gap-sm" style="list-style: none;">
              ${featuresHtml}
            </ul>
          </div>
        ` : ''}

        <div class="product-hero__meta">
          <div class="flex-between" style="margin-bottom: 30px;">
             <div>
               <div class="flex-row gap-xs text-accent text-upper text-bold text-xs" style="margin-bottom: 5px; letter-spacing: 0.15em;">
                  <div style="animation: pulse-border 2s infinite; background: var(--color-accent); border-radius: 50%; height: 6px; width: 6px;"></div>
                  Shop Signal: Active
               </div>
               <span class="text-upper text-xs text-bold text-faded" style="letter-spacing: 0.1em;">Single User License</span>
               <div class="product-hero__price" style="margin-top:5px;">${p.price}</div>
             </div>
             <span class="text-accent text-upper text-bold text-xs" style="border: 1px solid var(--color-accent); padding: 4px 10px; border-radius: 4px;">V7.5 Ready</span>
          </div>

          ${isLocked ? renderWaitlist(p) : `
            <div class="grid-col-1 gap-sm">
              <button class="btn btn--primary w-full" style="height: 64px; font-size: 1rem;" data-trigger="checkout:init" data-payload="${p.checkout}?embed=1" > ${btnLabel}</button>

              
              <button 
                class="btn btn--ghost w-full" 
                style="height: 56px;"
                data-trigger="cart:add" 
                data-payload="${p.id}"
              >
                Save to Shop
              </button>

              ${p.previewUrl ? `
                <a href="${p.previewUrl}" target="_blank" class="text-center text-xs text-bold text-upper text-faded" style="margin-top: 10px; letter-spacing: 0.1em;">
                  Launch Interactive Preview →
                </a>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    </div>

    <div class="mobile-sticky-cta" id="sticky-anchor">
       <div style="flex-shrink: 0;">
          <span class="text-bold" style="display: block; font-size: 0.55rem; opacity: 0.5;">${p.title}</span>
          <span class="text-display" style="font-size: 1.1rem;">${p.price}</span>
       </div>
       <button class="btn btn--primary" data-trigger="checkout:init" data-payload="${p.checkout}?embed=1" style="flex-grow: 1; font-size: 0.8rem; height: 50px;" > ${isLocked ? 'Notify Me' : 'Authorize'} 
       </button>

    </div>
  `;
}

function renderWaitlist(p) {
  return `
    <div class="card text-center" style="border: 1.5px solid var(--color-accent); animation: pulse-border 3s infinite;">
      <p class="text-accent text-upper text-bold text-xs" style="margin-bottom: 10px; letter-spacing: 0.2em;">${p.actionLabel || 'Engineering Mode'}</p>
      <p class="text-sm text-faded">Secure encryption in progress. This shop is currently being populated.</p>
    </div>
  `;
}
