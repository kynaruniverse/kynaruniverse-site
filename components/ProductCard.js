/* ==========================================================================
   COMPONENT | PRODUCT CARD (LIST VIEW LAYOUT)
   ========================================================================== */
export function renderCard(p) {
  const isLocked = p.status === 'coming-soon';
  const buttonLabel = isLocked ? 'LOCKED' : 'ADD TO CART';
  const modifierClass = isLocked ? 'product-card--locked' : '';
  
  // Create a "Read More" snippet
  const description = p.shortDesc.length > 60 
    ? p.shortDesc.substring(0, 60) + '...' 
    : p.shortDesc;

  return `
    <article class="product-card ${modifierClass} reveal-up" data-id="${p.id}">
      
      <div class="product-card__col-left">
        <div class="product-card__image-box" style="background: ${p.accentColor || 'var(--color-sage)'}">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="product-card__price">${p.price}</div>
      </div>

      <div class="product-card__col-right">
        
        <div class="product-card__header">
           <h3 class="product-card__title">${p.title}</h3>
           <span class="product-card__subtitle">Complete wealth management</span>
        </div>

        <div class="product-card__tags">
            <span class="tag-pill">${p.tag}</span>
            <span class="tag-pill">Digital</span>
        </div>

        <p class="product-card__body-text">
          ${description} <span class="text-link" data-trigger="modal:open" data-payload="${p.id}">Read More</span>
        </p>

        <div class="product-card__actions">
          <button class="btn btn--outline btn--sm" data-trigger="modal:open" data-payload="${p.id}">
            VIEW DETAILS
          </button>
          
          <button 
            class="btn btn--outline btn--sm" 
            data-trigger="cart:add" 
            data-payload="${p.id}"
            ${isLocked ? 'disabled' : ''}
          >
            ${buttonLabel}
          </button>
        </div>
      </div>
    </article>
  `;
}
