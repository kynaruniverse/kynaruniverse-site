/* ASTRYX LOADER (js/loader.js)
   Injects Product OR Guide data into templates.
*/
import { products, guides } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  
  // CHECK: Is this a Product request?
  if (params.has('id')) {
    const productId = params.get('id');
    const product = products[productId];
    if (product) loadProduct(product);
  } 
  // CHECK: Is this a Guide request?
  else if (params.has('guide')) {
    const guideId = params.get('guide');
    const guide = guides[guideId];
    if (guide) loadGuide(guide);
  }
});

function loadProduct(item) {
  document.body.setAttribute('data-theme', item.category);
  safeSetText('product-title', item.title);
  safeSetText('product-tag', item.tag);
  safeSetText('product-short-desc', item.shortDesc);
  safeSetText('product-lore', `"${item.loreWhisper}"`);
  safeSetText('product-desc', item.description);
  safeSetText('breadcrumb-category', capitalize(item.category));
  safeSetText('breadcrumb-title', item.title);
  
  const catLink = document.getElementById('link-category');
  if(catLink) catLink.href = `../${item.category}/index.html`;

  const tag = document.getElementById('product-tag');
  if(tag) tag.setAttribute('data-variant', item.category);

  const buyBtn = document.getElementById('btn-action');
  if(buyBtn) {
    buyBtn.textContent = item.actionBtn;
    buyBtn.onclick = () => window.open(item.gumroadLink, '_blank');
  }

  const preview = document.getElementById('product-preview');
  if(preview) preview.innerHTML = `<span style="font-size: 3rem;">${item.previewEmoji}</span>`;

  const featureList = document.getElementById('product-features');
  if(featureList && item.features) {
    featureList.innerHTML = item.features.map(f => `<li>${f}</li>`).join('');
  }
}

function loadGuide(item) {
  document.body.setAttribute('data-theme', 'hub'); // Guides always use Hub theme
  safeSetText('guide-title', item.title);
  safeSetText('guide-date', item.date);
  safeSetText('guide-readtime', item.readTime);
  safeSetText('breadcrumb-title', item.title);
  
  // Inject HTML Content
  const contentBox = document.getElementById('guide-content');
  if(contentBox) contentBox.innerHTML = item.content;
}

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}
