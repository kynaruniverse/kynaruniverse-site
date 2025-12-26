import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBCrZmrwbiAP4SFoIZrBYmJaYszdAj8pk",
    authDomain: "kynar-universe-official.firebaseapp.com",
    projectId: "kynar-universe-official",
    storageBucket: "kynar-universe-official.firebasestorage.app",
    messagingSenderId: "1089722386738",
    appId: "1:1089722386738:web:372e68ab876deb4707ef2b"
};

// Initialize Services with Singleton Pattern
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    if (!/already-exists/.test(e.code)) {
        console.error("Firebase initialization error", e);
    }
}

const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Advanced Registration Flow
 * execute profile update and DB creation in parallel for performance.
 */
const registerUser = async (email, password, displayName) => {
    try {
        // 1. Create Auth User
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const finalName = displayName || "Creator";
        const now = new Date().toISOString();

        // 2. Parallel Execution: Update Profile & Create Firestore Doc
        // We use Promise.all to fire both network requests simultaneously.
        await Promise.all([
            // Task A: Update local Auth profile
            updateProfile(user, { displayName: finalName }),
            
            // Task B: Create remote Firestore document
            setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                displayName: finalName,
                createdAt: now,
                updatedAt: now,
                role: "user",
                purchases: [],
                wishlist: []
            }, { merge: true })
        ]);

        return user;
    } catch (error) {
        console.error("Registration Error:", error);
        throw error; // Re-throw to be handled by the UI layer
    }
};

// Export Services & Method Wrappers
export { 
    auth, 
    db, 
    registerUser, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    // Firestore Helpers
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
};
