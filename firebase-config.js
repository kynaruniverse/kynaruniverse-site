/**
 * SOFT ROYAL CONNECTION
 * Role: Initialize external database connection (Firebase)
 * Status: Configured with 'kynar-universe-official' credentials
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION ---
// These are your actual keys extracted from your old file.
const firebaseConfig = {
    apiKey: "AIzaSyDBCrZmrwbiAP4SFoIZrBYmJaYszdAj8pk",
    authDomain: "kynar-universe-official.firebaseapp.com",
    projectId: "kynar-universe-official",
    storageBucket: "kynar-universe-official.firebasestorage.app",
    messagingSenderId: "1089722386738",
    appId: "1:1089722386738:web:372e68ab876deb4707ef2b"
};

// --- INITIALIZATION ---
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Soft Royal Connection: Established (kynar-universe-official)');
} catch (error) {
    console.error('Soft Royal Connection Failed:', error);
}

// Export for use in auth.js
export { app, auth, db };
