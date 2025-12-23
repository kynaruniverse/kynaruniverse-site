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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose services globally for other non-module scripts (like auth-ui.js)
window._firebaseAuth = auth;
window._firebaseOnAuthStateChanged = onAuthStateChanged;
window._firebaseSignIn = signInWithEmailAndPassword;

window._firebaseSignUp = async (auth, email, pass, displayName) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCred.user.uid;
    
    // 1. Update Auth Profile
    await updateProfile(userCred.user, { displayName: displayName || "" });
    
    // 2. Create Firestore Document
    const userDocRef = doc(db, "users", uid);
    const now = new Date().toISOString();
    
    await setDoc(userDocRef, {
        email,
        displayName: displayName || "",
        createdAt: now,
        updatedAt: now
    }, { merge: true });
    
    return userCred;
};

window._firebaseSignOut = signOut;
window._firebaseDb = db;

console.log('✅ Firebase initialized successfully');
