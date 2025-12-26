/**
 * KYNAR UNIVERSE - QUIET FORGE ENGINE
 * Role: Archive Renderer & Satchel Logic
 */

const ForgeEngine = (() => {

        // --- 1. REAL INVENTORY (Artifacts) ---
    const ARTIFACTS = [
        {
            id: 'art_001',
            title: 'Kynar Daily Planner',
            collection: 'productivity', // Matches filter
            price: 0.00, // Set your real price
            image: 'images/1/planner-cover.webp', // You need to upload a cover image here!
            tag: 'PDF Planner',
            downloadLink: 'assets/kynar-daily-planner.pdf' // Internal reference
        },
        {
            id: 'art_002',
            title: '10 AI Prompts',
            collection: 'automation',
            price: 0.00, 
            image: 'images/1/ai-cover.webp', 
            tag: 'Prompt Pack',
            downloadLink: 'assets/10-ai-prompts.pdf'
        },
        {
            id: 'art_003',
            title: 'Python Cheatsheet',
            collection: 'automation', // or 'learning'
            price: 0.00,
            image: 'images/1/python-cover.webp',
            tag: 'Reference Guide',
            downloadLink: 'assets/python-basic-cheatsheet.pdf'
        },
        {
            id: 'art_004',
            title: 'Worldbuilding Checklist',
            collection: 'creative',
            price: 0.00,
            image: 'images/1/world-cover.webp',
            tag: 'Creative Tool',
            downloadLink: 'assets/worldbuilding-checklist.pdf'
        }
    ];


    const DOM = {
        grid: document.getElementById('artifact-grid'),
        search: document.getElementById('archive-search'),
        filters: document.querySelectorAll('#filter-stream button')
    };

    // --- 2. RENDERER ---
    const Renderer = {
        
        buildGrid(items) {
            if (!DOM.grid) return;
            
            DOM.grid.style.opacity = '0';
            
            setTimeout(() => {
                DOM.grid.innerHTML = ''; 

                if (items.length === 0) {
                    DOM.grid.innerHTML = `
                        <div style="grid-column: 1/-1; padding: 4rem 0; text-align: center; color: var(--ink-secondary);">
                            <h3 class="text-heading">Silence.</h3>
                            <p>No artifacts found matching your request.</p>
                        </div>`;
                } else {
                    items.forEach(item => {
                        const html = this.createBlock(item);
                        DOM.grid.insertAdjacentHTML('beforeend', html);
                    });
                }
                
                DOM.grid.style.opacity = '1';
                DOM.grid.style.transition = 'opacity 0.4s ease';
            }, 200);
        },

        createBlock(item) {
            const formattedPrice = `£${item.price.toFixed(2)}`;
            
            return `
            <article class="stone-block">
                <div style="width: 100%; aspect-ratio: 1/1; background: #E6E6E2; margin-bottom: 1.5rem; border-radius: 2px; display:flex; align-items:center; justify-content:center;">
                    ${item.image 
    ? `<img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit: cover; transition: opacity 0.5s ease;">` 
    : `<span style="color:#B0B0A8; font-size:0.8rem; letter-spacing:0.1em;">ARTIFACT</span>`
}

                </div>
                
                <span class="stone-meta">${item.tag}</span>
                <h3 class="text-heading" style="font-size: 1.25rem; margin-bottom: 0.5rem;">${item.title}</h3>
                
                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; width: 100%; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;">
                    <span class="text-body" style="margin:0; font-weight:bold;">${formattedPrice}</span>
                    
                    <button onclick="ForgeEngine.addToSatchel('${item.id}')" class="ink-link" style="background:none; border:none; border-bottom:1px solid transparent; cursor:pointer; padding:0;">
                        Gather
                    </button>
                </div>
            </article>
            `;
        }
    };

    // --- 3. SATCHEL LOGIC (Cart) ---
    const Satchel = {
        add(id) {
            const item = ARTIFACTS.find(i => i.id === id);
            if (!item) return;

            let satchel = JSON.parse(localStorage.getItem('kynar_cart') || '[]');
            satchel.push(item);
            localStorage.setItem('kynar_cart', JSON.stringify(satchel));

            // Visual Feedback
            this.updateCount();
            alert(`Gathered: ${item.title}`); // Temporary simple feedback
        },

        updateCount() {
            // Check if utility exists (it might be loaded async)
            if (window.ForgeUtils) {
                window.ForgeUtils.updateSatchelCount();
            }
        }
    };

    // --- 4. CONTROLLER ---
    const Controller = {
        init() {
            // Archive Logic
            if (DOM.grid) {
                // Check URL params for collection filter
                const urlParams = new URLSearchParams(window.location.search);
                const collection = urlParams.get('collection');

                if (collection) {
                    const filtered = ARTIFACTS.filter(i => i.collection === collection);
                    Renderer.buildGrid(filtered);
                    this.highlightFilter(collection);
                } else {
                    Renderer.buildGrid(ARTIFACTS);
                }

                this.bindEvents();
            }
            console.log('Quiet Forge Engine: Active');
        },

        bindEvents() {
            if (DOM.search) {
                DOM.search.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    const filtered = ARTIFACTS.filter(i => 
                        i.title.toLowerCase().includes(term) || 
                        i.collection.includes(term)
                    );
                    Renderer.buildGrid(filtered);
                });
            }

            if (DOM.filters) {
                DOM.filters.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const filter = btn.dataset.filter;
                        this.highlightFilter(filter);
                        
                        let result = (filter === 'all') 
                            ? ARTIFACTS 
                            : ARTIFACTS.filter(i => i.collection === filter);
                        
                        Renderer.buildGrid(result);
                    });
                });
            }
        },

        highlightFilter(filterName) {
            DOM.filters.forEach(b => {
                b.style.color = (b.dataset.filter === filterName) 
                    ? 'var(--ink-primary)' 
                    : 'var(--ink-secondary)';
            });
        }
    };

    return {
        init: Controller.init,
        addToSatchel: Satchel.add
    };

})();

document.addEventListener('DOMContentLoaded', ForgeEngine.init);
