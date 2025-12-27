/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: SOFT ROYAL CONNECTION (FIREBASE)
 * ══════════════════════════════════════════════════════════════════════════
 * @description Initializes the external database connection using Firebase SDKs.
 * Exports the initialized App, Auth, and Firestore instances for use throughout
 * the application.
 * @module FirebaseConfig
 * @status Configured (kynar-universe-official)
 */

// #region [ 0. EXTERNAL SDK IMPORTS ]

// Import the specific functions needed from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// #endregion

// #region [ 1. CONFIGURATION ]

/**
 * Firebase Configuration Object.
 * Contains public identifiers for the client-side app.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDBCrZmrwbiAP4SFoIZrBYmJaYszdAj8pk",
  authDomain: "kynar-universe-official.firebaseapp.com",
  projectId: "kynar-universe-official",
  storageBucket: "kynar-universe-official.firebasestorage.app",
  messagingSenderId: "1089722386738",
  appId: "1:1089722386738:web:372e68ab876deb4707ef2b",
};

// #endregion

// #region [ 2. INITIALIZATION ]

// Declare exports
let app, auth, db;

/**
 * Attempt to initialize the Firebase App.
 * Catches errors if the CDN fails to load or config is invalid.
 */
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  console.log("Soft Royal Connection: Established (kynar-universe-official)");
} catch (error) {
  console.error("Soft Royal Connection Failed:", error);
}

// #endregion

// Export instances for use in auth.js and other modules
export { app, auth, db };
