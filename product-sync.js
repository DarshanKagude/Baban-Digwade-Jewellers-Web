/**
 * product-sync.js
 * Loads admin-added products, stock status, and custom collections from Firebase Realtime Database.
 * Must be included AFTER data.js on any page that shows products (category.html, product-detail.html, index.html).
 */
import { db, ref, onValue } from './firebase-config.js';

// ─── Collections Sync ────────────────────────────────────────────────────────
// Loads admin-added collections from Firebase and merges with DEFAULT_COLLECTIONS
onValue(ref(db, 'settings/customCollections'), (snap) => {
    const firebaseCustom = snap.exists() ? Object.values(snap.val()) : [];
    const defaultCols = window.DEFAULT_COLLECTIONS || [];

    // If Firebase collections exist, use them exclusively (allows deleting defaults)
    // Otherwise, use the hardcoded defaults
    const all = firebaseCustom.length > 0 ? firebaseCustom : defaultCols;

    // Override getCollectionsList so category.html and filters always use live data
    window.getCollectionsList = () => all;
    window.customCollections = all;

    // Fire event so category.html can rebuild collection filters
    window.dispatchEvent(new CustomEvent('collectionsReady', { detail: all }));
    console.log('Collections loaded from Firebase:', firebaseCustom);
});


// ─── Products Sync ───────────────────────────────────────────────────────────
// Loads admin-added products, deletions, and stock overrides from Firebase
function mergeFirebaseProducts() {
    const customRef = ref(db, 'products/custom');
    const deletedRef = ref(db, 'products/deleted');
    const stockRef = ref(db, 'products/stockStatus');

    let deletedCodes = {};
    let stockOverrides = {};
    let customProducts = {};

    let deletedLoaded = false;
    let stockLoaded = false;
    let customLoaded = false;

    // Backup the initial data.js products once to allow repeated safe merges
    if (!window._initialBuiltInProducts) {
        window._initialBuiltInProducts = JSON.parse(JSON.stringify(window.products || {}));
    }

    function tryApply() {
        if (!deletedLoaded || !stockLoaded || !customLoaded) return;

        // Start with a fresh clone of the original data.js products
        const products = JSON.parse(JSON.stringify(window._initialBuiltInProducts));

        // 1. Remove deleted built-in products
        const deletedKeys = Object.keys(deletedCodes);
        for (const cat in products) {
            products[cat] = products[cat].filter(p => !deletedKeys.includes(p.code));
        }

        // 2. Merge Firebase custom products
        Object.values(customProducts).forEach(prod => {
            const cat = prod.category;
            if (!products[cat]) products[cat] = [];
            // Mark as custom for admin identification
            const customItem = { ...prod, _isCustom: true };
            // Avoid duplicates
            if (!products[cat].some(p => p.code === prod.code)) {
                products[cat].unshift(customItem);
            }
        });

        // 3. Apply stock overrides to all products
        for (const cat in products) {
            products[cat].forEach(item => {
                if (stockOverrides[item.code]) {
                    item.stockStatus = stockOverrides[item.code];
                } else if (!item.stockStatus) {
                    item.stockStatus = 'in-stock';
                }
            });
        }

        window.products = products;

        // Notify pages that products are ready
        window.dispatchEvent(new CustomEvent('productsReady', { detail: products }));
        console.log('Products loaded from Firebase and merged.');
    }

    onValue(deletedRef, (snap) => {
        deletedCodes = snap.exists() ? snap.val() : {};
        deletedLoaded = true;
        tryApply();
    });

    onValue(stockRef, (snap) => {
        stockOverrides = snap.exists() ? snap.val() : {};
        stockLoaded = true;
        tryApply();
    });

    onValue(customRef, (snap) => {
        customProducts = snap.exists() ? snap.val() : {};
        customLoaded = true;
        tryApply();
    });
}

mergeFirebaseProducts();
