/**
 * KYNAR UNIVERSE - Elastic Checkout Logic
 * Architect: KynarForge Pro
 * Evolution: Platinum Plus Secure Gateway
 */

import { auth, db, doc, updateDoc, arrayUnion, onAuthStateChanged } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM ELEMENTS ---
    const form = document.getElementById('checkout-form');
    const emptyState = document.getElementById('checkout-empty');
    const itemsList = document.getElementById('checkout-items-list');
    const totalDisplay = document.getElementById('checkout-total-display');
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');

    // --- 1. LOAD CART DATA ---
    const rawData = localStorage.getItem('kynar_cart_v1');
    const cartItems = rawData ? JSON.parse(rawData) : [];

    if (cartItems.length === 0) {
        if(form) form.remove(); 
        if(emptyState) emptyState.style.display = 'block';
        return;
    }

    // --- 2. RENDER UI (Platinum Editorial Style) ---
    if(form) form.style.display = 'grid'; 
    
    // Calculate Total
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    if(totalDisplay) totalDisplay.textContent = `£${total.toFixed(2)}`;

    // Render List with Tactile Borders
    if(itemsList) {
        itemsList.innerHTML = cartItems.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px;">
                <span style="font-size: 14px; font-weight: bold; color: var(--text-main);">${item.title}</span>
                <span style="font-weight: bold; color: var(--gold-neon);">£${item.price.toFixed(2)}</span>
            </div>
        `).join('');
    }

    // --- 3. AUTH CHECK & AUTO-FILL ---
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            if(nameInput && !nameInput.value) nameInput.value = user.displayName || '';
            if(emailInput && !emailInput.value) emailInput.value = user.email || '';
        }
    });

    // --- 4. HANDLE SUBMISSION ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                // Trigger Platinum Auth Modal
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.classList.add('is-open'); 
                    document.querySelector('.drawer-overlay')?.classList.add('is-visible');
                    alert("Identity verification required to access the vault.");
                }
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            if(window.LoadingState) window.LoadingState.buttonStart(btn);
            
            try {
                // A. Prepare Purchase Data
                const newPurchases = cartItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    purchaseDate: new Date().toISOString(),
                    downloadUrl: 'guide-download.html' 
                }));

                // B. Write to Firestore
                const userRef = doc(db, "users", currentUser.uid);
                
                await updateDoc(userRef, {
                    purchases: arrayUnion(...newPurchases)
                });

                // C. Success Handling
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "ACQUIRED");
                
                localStorage.removeItem('kynar_cart_v1');
                
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);

            } catch (error) {
                console.error("Order Error:", error);
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "FAILED");
                alert("Transaction interrupted. Please verify your connection.");
            }
        });
    }

    console.log("💳 Secure Gateway Synchronized");
});
