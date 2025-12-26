/**
 * KYNAR UNIVERSE - Checkout Logic (Firebase Integrated)
 * Architect: KynarForge Pro
 * Description: Handles order processing and saves purchases to Firestore.
 * Status: GOLD MASTER (Visuals Polished)
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

    // --- 2. RENDER UI ---
    if(form) form.style.display = 'grid'; 
    
    // Calculate Total
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    if(totalDisplay) totalDisplay.textContent = `£${total.toFixed(2)}`;

    // Render List (Updated for Kynar 2026 Dark Mode)
    if(itemsList) {
        itemsList.innerHTML = cartItems.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                <span class="text-white" style="font-size: 14px;">${item.title}</span>
                <span class="text-gold" style="font-weight: bold;">£${item.price.toFixed(2)}</span>
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

    // --- 4. HANDLE SUBMISSION (REAL DATABASE WRITE) ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                // If not logged in, force open the Auth Modal instead of a boring alert
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    // Manually toggle class if UI helper isn't available in this scope
                    authModal.classList.add('is-open'); 
                    document.getElementById('drawer-overlay')?.classList.add('is-visible');
                    alert("Security Protocol: Please Identify (Sign In) to proceed.");
                } else {
                    alert("Please sign in to complete your purchase.");
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
                    // In a real app, you'd map IDs to real URLs here
                    downloadUrl: 'guide-download.html' 
                }));

                // B. Write to Firestore
                const userRef = doc(db, "users", currentUser.uid);
                
                await updateDoc(userRef, {
                    purchases: arrayUnion(...newPurchases)
                });

                // C. Success Handling
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "Confirmed!");
                
                // Clear Cart & Redirect
                localStorage.removeItem('kynar_cart_v1');
                
                // Optional: Short delay to let user see "Confirmed!"
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);

            } catch (error) {
                console.error("Order Error:", error);
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "Failed");
                alert("Transaction Failed. Check network connection.");
            }
        });
    }

    console.log("💳 Secure Gateway Online");
});
