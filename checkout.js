/**
 * KYNAR UNIVERSE - Checkout Logic (Firebase Integrated)
 * Architect: KynarForge Pro
 * Description: Handles order processing and saves purchases to Firestore.
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

    // Render List
    if(itemsList) {
        itemsList.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <span>${item.title}</span>
                <span>£${item.price.toFixed(2)}</span>
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
        } else {
            // Optional: Redirect to login or show guest checkout warning
            console.log("Guest checkout active");
        }
    });

    // --- 4. HANDLE SUBMISSION (REAL DATABASE WRITE) ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                alert("Please sign in to complete your purchase.");
                // Trigger login modal via existing logic if possible, or redirect
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            if(window.LoadingState) window.LoadingState.buttonStart(btn);
            
            try {
                // A. Prepare Purchase Data
                // Map cart items to the format account.html expects
                const newPurchases = cartItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    purchaseDate: new Date().toISOString(),
                    downloadUrl: '#' // In a real app, this would be the actual file link
                }));

                // B. Write to Firestore
                // We use 'arrayUnion' to add items without overwriting existing history
                const userRef = doc(db, "users", currentUser.uid);
                
                // We loop through items to add them (arrayUnion takes args, but for safety we do one update)
                // Note: arrayUnion treats objects as unique by value.
                await updateDoc(userRef, {
                    purchases: arrayUnion(...newPurchases)
                });

                // C. Success Handling
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "Confirmed!");
                
                // Clear Cart
                localStorage.removeItem('kynar_cart_v1');
                
                alert("Order Successful! Redirecting to your library...");
                window.location.href = 'account.html';

            } catch (error) {
                console.error("Order Error:", error);
                if(window.LoadingState) window.LoadingState.buttonEnd(btn, "Failed");
                alert("There was an error processing your order. Please try again.");
            }
        });
    }

    console.log("💳 Checkout System Online (Firebase Active)");
});
