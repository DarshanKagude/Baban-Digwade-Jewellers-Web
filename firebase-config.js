// Firebase Configuration
// Replace the config object below with your actual Firebase project configuration
// To get this: Firebase Console > Project Settings > General > Your apps > Web apps

const firebaseConfig = {
    apiKey: "AIzaSyA9BH657k0ftD8Mv2_7rRe4S87UrHKu_HQ",
    authDomain: "baban-digwade-jewellers.firebaseapp.com",
    projectId: "baban-digwade-jewellers",
    storageBucket: "baban-digwade-jewellers.firebasestorage.app",
    messagingSenderId: "661014845613",
    appId: "1:661014845613:web:b3847896e90065d264ce24",
    databaseURL: "https://baban-digwade-jewellers-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, push, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, ref, onValue, set, get, push, remove, update, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail };
