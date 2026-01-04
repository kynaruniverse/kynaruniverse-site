export function renderCard(p) {
  const isLocked = p.status === 'coming-soon';
  const buttonLabel = isLocked ? 'LOCKED' : 'ADD TO CART';
  const modifierClass = isLocked ? 'product-card--locked' : '';
  
  return `
    <article class="product-card ${modifierClass} reveal-up" data-id="${p.id}">
      <div class="product-card__media">
        <div class="product-card__image-box" style="background: ${p.accentColor || 'var(--color-sage)'}">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
      </div>
      <div class="product-card__body">
        <div class="flex-between w-full" style="margin-bottom: 12px;">
           <span class="tag-pill">${p.tag}</span>
           <span class="product-card__price">${p.price}</span>
        </div>
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__short-desc">${p.shortDesc}</p>
        <div class="product-card__actions">
          <button class="btn btn--outline" data-trigger="modal:open" data-payload="${p.id}">View Details</button>
          <button class="btn btn--primary" data-trigger="cart:add" data-payload="${p.id}" ${isLocked ? 'disabled' : ''}>${buttonLabel}</button>
        </div>
      </div>
    </article>
  `;
}
