import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBCrZmrwbiAP4SFoIZrBYmJaYszdAj8pk",
    authDomain: "kynar-universe-official.firebaseapp.com",
    projectId: "kynar-universe-official",
    storageBucket: "kynar-universe-official.firebasestorage.app",
    messagingSenderId: "1089722386738",
    appId: "1:1089722386738:web:372e68ab876deb4707ef2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Custom Sign Up Function
 * Handles Auth creation + Profile Update + Firestore User Document
 */
const registerUser = async (email, password, displayName) => {
    // 1. Create Auth User
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    
    // 2. Update Auth Profile (Display Name)
    await updateProfile(user, { displayName: displayName || "Creator" });
    
    // 3. Create Firestore Document
    const now = new Date().toISOString();
    await setDoc(doc(db, "users", user.uid), {
        email: email,
        displayName: displayName || "Creator",
        createdAt: now,
        updatedAt: now,
        purchases: [], // Initialize empty arrays
        wishlist: []
    }, { merge: true });

    return user;
};

// Export services and helpers for other modules to use
export { auth, db, registerUser, signInWithEmailAndPassword, signOut, onAuthStateChanged };
console.log('✅ Firebase Module Initialized');
