/**
 * KYNAR UNIVERSE - Firebase Engine (2026 Edition)
 * Architect: AetherCode
 * Description: Core data backbone for Identity and the Digital Vault.
 * Evolution: Platinum Plus Parallel Logic
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBCrZmrwbiAP4SFoIZrBYmJaYszdAj8pk",
    authDomain: "kynar-universe-official.firebaseapp.com",
    projectId: "kynar-universe-official",
    storageBucket: "kynar-universe-official.firebasestorage.app",
    messagingSenderId: "1089722386738",
    appId: "1:1089722386738:web:372e68ab876deb4707ef2b"
};

// Initialize Application Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * INITIALIZE IDENTITY PROTOCOL
 * Orchestrates Auth profile and Firestore record in parallel.
 * Optimized for the 2026 "Zero-Latency" UX.
 */
const registerUser = async (email, password, displayName) => {
    try {
        // 1. Authenticate Initial Signal
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const finalName = displayName || "Architect";
        const now = new Date().toISOString();

        // 2. Parallel Synchronization
        // Fires both Identity and Data-Vault initialization simultaneously.
        await Promise.all([
            // Local Profile Mapping
            updateProfile(user, { displayName: finalName }),
            
            // Database Record Establishment
            setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                displayName: finalName,
                established: now,
                lastSync: now,
                accessLevel: "founding_member",
                purchases: [],
                wishlist: []
            }, { merge: true })
        ]);

        return user;
    } catch (error) {
        console.error("Identity Protocol Error:", error);
        throw error;
    }
};

// Export Synchronized Services
export { 
    auth, 
    db, 
    registerUser, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
};
