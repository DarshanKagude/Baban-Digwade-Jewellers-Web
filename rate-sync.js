import { db, doc, onSnapshot, auth, onAuthStateChanged } from './firebase-config.js';

// Global prices object is expected to be available from data.js
// If not, we initialize a local one
if (typeof window.prices === 'undefined') {
    window.prices = {};
}

// Subscribe to real-time updates
const ratesDoc = doc(db, 'settings', 'rates');

onSnapshot(ratesDoc, (docSnap) => {
    if (docSnap.exists()) {
        const newPrices = docSnap.data();
        console.log("Rates updated from Firebase:", newPrices);

        // Update global prices object
        window.prices = { ...window.prices, ...newPrices };

        // Persist to localStorage for offline support / faster initial load
        localStorage.setItem('bdj_prices', JSON.stringify(window.prices));

        // Dispatch custom event so pages can re-render
        const event = new CustomEvent('ratesUpdated', { detail: window.prices });
        window.dispatchEvent(event);
    } else {
        console.log("No rates document found in Firebase. Using defaults.");
    }
}, (error) => {
    console.error("Error listening to rates:", error);
});

// Watch Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        localStorage.setItem('bdj_user_session', 'true');
        localStorage.setItem('bdj_user_uid', user.uid);
    } else {
        console.log("No user signed in.");
        localStorage.removeItem('bdj_user_session');
        localStorage.removeItem('bdj_user_uid');
    }
});
