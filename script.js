/**
 * KYNAR UNIVERSE - QUIET FORGE ENGINE v1.0
 * Role: Archive Renderer & Logic
 * Philosophy: Calm, Client-Side Speed, No Jitter.
 */

const KynarArchive = (() => {

    // --- 1. MOCK DATA (The Archive Content) ---
    // In production, this would be fetched from Firebase/JSON
    const INVENTORY = [
        {
            id: 'p1',
            title: 'The Deep Focus OS',
            category: 'productivity',
            price: '£24.00',
            image: null, // Placeholder logic used if null
            tag: 'Notion System'
        },
        {
            id: 'p2',
            title: 'Morning Rituals',
            category: 'productivity',
            price: '£12.00',
            image: null,
            tag: 'Planner PDF'
        },
        {
            id: 'p3',
            title: 'Homeschool: Nature',
            category: 'homeschool',
            price: '£8.50',
            image: null,
            tag: 'Printable Pack'
        },
        {
            id: 'p4',
            title: 'Quiet Python Scripts',
            category: 'automation',
            price: '£30.00',
            image: null,
            tag: 'Automation'
        },
        {
            id: 'p5',
            title: 'Mindful Colouring: Vol 1',
            category: 'creative',
            price: '£10.00',
            image: null,
            tag: 'Digital Book'
        },
        {
            id: 'p6',
            title: 'The Stoic Journal',
            category: 'creative',
            price: '£15.00',
            image: null,
            tag: 'Interactive PDF'
        }
    ];

    // --- 2. STATE & CACHE ---
    const DOM = {
        grid: document.getElementById('products-container'),
        searchInput: document.getElementById('search-input'),
        filterBtns: document.querySelectorAll('#filter-container button')
    };

    // --- 3. RENDER LOGIC (The Stone Builder) ---
    const Renderer = {
        
        buildGrid(items) {
            // Soft Clear
            DOM.grid.style.opacity = '0';
            
            setTimeout(() => {
                DOM.grid.innerHTML = ''; // Wipe

                if (items.length === 0) {
                    this.renderEmptyState();
                } else {
                    items.forEach(item => {
                        const html = this.createStoneBlock(item);
                        DOM.grid.insertAdjacentHTML('beforeend', html);
                    });
                }
                
                // Reveal
                DOM.grid.style.opacity = '1';
                DOM.grid.style.transition = 'opacity 0.4s ease';
            }, 200); // Slight delay for "Breath"
        },

        createStoneBlock(product) {
            // Uses the "Stone Block" HTML structure from Quiet Forge styles
            return `
            <article class="stone-block product-item" data-category="${product.category}">
                <div style="width: 100%; aspect-ratio: 1/1; background: #E6E6E2; margin-bottom: 1.5rem; border-radius: 2px; position: relative; overflow: hidden;">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit: cover;">` 
                        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color: #A4A4A0; font-size: 0.8rem; text-transform:uppercase; letter-spacing:0.1em;">NO IMAGE</div>`
                    }
                </div>
                
                <span class="stone-meta">${product.tag}</span>
                <h3 class="text-heading" style="font-size: 1.25rem; margin-bottom: 0.5rem;">${product.title}</h3>
                
                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; width: 100%; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;">
                    <span class="text-body" style="margin:0; font-weight:bold;">${product.price}</span>
                    <a href="#" class="ink-link" style="font-size: 0.75rem;">Examine</a>
                </div>
            </article>
            `;
        },

        renderEmptyState() {
            DOM.grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 4rem 0; text-align: center; color: var(--ink-secondary);">
                    <h3 class="text-heading">The Archive is silent.</h3>
                    <p>No artifacts found matching your request.</p>
                </div>
            `;
        }
    };

    // --- 4. CONTROLLER (The Logic) ---
    const Controller = {
        init() {
            if (!DOM.grid) return; // Guard clause

            // Initial Render
            Renderer.buildGrid(INVENTORY);
            
            // Event Listeners
            this.bindSearch();
            this.bindFilters();
            
            console.log('🌑 Quiet Forge Archive: Online');
        },

        bindSearch() {
            if (!DOM.searchInput) return;

            DOM.searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = INVENTORY.filter(item => 
                    item.title.toLowerCase().includes(term) || 
                    item.category.includes(term)
                );
                Renderer.buildGrid(filtered);
            });
        },

        bindFilters() {
            if (!DOM.filterBtns) return;

            DOM.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.filter;
                    
                    // Logic: Visual State handled in HTML inline script, 
                    // but we reinforce here for robustness if needed.
                    
                    let filtered;
                    if (category === 'all') {
                        filtered = INVENTORY;
                    } else {
                        filtered = INVENTORY.filter(item => item.category === category);
                    }
                    
                    Renderer.buildGrid(filtered);
                });
            });
        }
    };

    return {
        init: Controller.init
    };

})();

// Boot Sequence
document.addEventListener('DOMContentLoaded', () => {
    KynarArchive.init();
});
