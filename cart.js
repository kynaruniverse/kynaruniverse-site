/**
 * SOFT ROYAL CART LOGIC
 * Role: Manage Satchel state, persistence, and Drawer UI
 */

const Satchel = {
    
    getKey() { return 'kynar_cart'; },

    // --- DATA MANAGEMENT ---
    getContents() {
        return JSON.parse(localStorage.getItem(this.getKey()) || '[]');
    },

    add(artifactOrId) {
        // Handle both ID string (from Archive) and Object (from Artifact page)
        let artifact = artifactOrId;
        
        // If string, fetch full object from global Archive DB if possible, or fail gracefully
        if (typeof artifactOrId === 'string') {
            if (window.ArchiveSystem) {
                const db = window.ArchiveSystem.getDb();
                artifact = db.find(i => i.id === artifactOrId);
            }
        }

        if (!artifact) {
            console.error("Artifact data missing.");
            return;
        }

        const contents = this.getContents();
        if (!contents.find(item => item.id === artifact.id)) {
            contents.push(artifact);
            this.save(contents);
            this.openDrawer(); // Auto-open to confirm add
            
            if (window.Haptics) window.Haptics.success();
            return true;
        } else {
            this.openDrawer(); // Already exists, just show cart
            return false;
        }
    },

    remove(artifactId) {
        let contents = this.getContents();
        contents = contents.filter(item => item.id !== artifactId);
        this.save(contents);
        // If on checkout page, refresh that list too
        if (window.removeItem && typeof window.removeItem === 'function' && document.getElementById('manifest-list')) {
             // Let checkout.js handle its own render if active
        }
    },

    clear() {
        localStorage.removeItem(this.getKey());
        this.updateUI();
        this.renderDrawer();
    },

    save(contents) {
        localStorage.setItem(this.getKey(), JSON.stringify(contents));
        this.updateUI();
        this.renderDrawer();
    },

    total() {
        return this.getContents().reduce((sum, item) => sum + item.price, 0);
    },

    // --- UI UPDATES ---
    updateUI() {
        const count = this.getContents().length;
        const badge = document.getElementById('satchel-count');
        
        if (badge) {
            if (count > 0) {
                badge.style.display = 'block';
                // Optional: badge.textContent = count; 
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // --- DRAWER INTERACTION ---
    initDrawer() {
        // Target the new button ID from header.html
        const trigger = document.getElementById('satchel-trigger');
        const backdrop = document.getElementById('satchel-drawer-backdrop');
        const closeBtn = document.getElementById('close-drawer');
        
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDrawer();
            });
        }
        
        if (backdrop) backdrop.addEventListener('click', () => this.closeDrawer());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());

        // Initial render check
        this.updateUI();
    },

    openDrawer() {
        this.renderDrawer();
        const drawer = document.getElementById('satchel-drawer');
        const backdrop = document.getElementById('satchel-drawer-backdrop');
        
        if (drawer && backdrop) {
            drawer.classList.add('is-open');
            backdrop.classList.add('is-visible');
        }
    },

    closeDrawer() {
        const drawer = document.getElementById('satchel-drawer');
        const backdrop = document.getElementById('satchel-drawer-backdrop');
        
        if (drawer && backdrop) {
            drawer.classList.remove('is-open');
            backdrop.classList.remove('is-visible');
        }
    },

    // --- GLASS DRAWER RENDERER ---
    renderDrawer() {
        const container = document.getElementById('drawer-items');
        const totalEl = document.getElementById('drawer-total');
        const items = this.getContents();

        if (totalEl) totalEl.textContent = `£${this.total().toFixed(2)}`;
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; margin-top: 3rem; opacity: 0.6;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🍂</div>
                    <p>Your satchel is empty.</p>
                    <a href="archive.html" onclick="Satchel.closeDrawer()" style="display: inline-block; margin-top: 1rem; color: var(--accent-gold); font-weight: bold; font-size: 0.9rem; cursor: pointer;">Discover Artifacts →</a>
                </div>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                
                <div style="width: 50px; height: 50px; background: var(--grad-emerald); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; flex-shrink: 0;">
                    ${item.image ? `<img src="${item.image}" style="width:100%; height:100%; object-fit: cover; border-radius: 12px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` : ''}
                    <span style="${item.image ? 'display:none;' : ''}">${item.icon || '✦'}</span>
                </div>

                <div style="flex: 1;">
                    <h4 style="font-family: 'Bantayog'; font-size: 1rem; color: var(--ink-display); margin-bottom: 2px;">${item.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--ink-muted); text-transform: uppercase;">${item.collection || 'Artifact'}</span>
                </div>

                <div style="text-align: right;">
                    <div style="font-weight: bold; font-size: 0.9rem; font-family: 'Glacial Indifference'; margin-bottom: 4px;">£${item.price.toFixed(2)}</div>
                    <button onclick="Satchel.remove('${item.id}')" style="background: none; border: none; color: var(--accent-red); font-size: 0.7rem; cursor: pointer; opacity: 0.7;">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    },

    // --- GATEKEEPER / DIRECT DOWNLOAD ---
    directDownload(url) {
        // In a real app, check for email/auth here first
        const hasAuth = localStorage.getItem('kynar_signal_token');
        
        if (hasAuth || true) { // Bypassing for demo purposes
            if (window.Haptics) window.Haptics.success();
            
            // Create temporary link to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            alert("Download starting...");
        } else {
            alert("Please join The Signal to unlock free downloads.");
            window.location.href = 'signals.html';
        }
    }
};

// Global Exposure
window.Satchel = Satchel;

// Init Listener (Wait for Header)
document.addEventListener('DOMContentLoaded', () => {
    // Check every 100ms for the header to be injected by the component loader
    const checkHeader = setInterval(() => {
        if (document.getElementById('satchel-trigger')) {
            Satchel.initDrawer();
            clearInterval(checkHeader);
        }
    }, 100);
    
    // Fallback stop after 3 seconds
    setTimeout(() => clearInterval(checkHeader), 3000);
});
