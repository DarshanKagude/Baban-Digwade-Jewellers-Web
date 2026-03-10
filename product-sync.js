/**
 * product-sync.js
 * Loads admin-added products and stock status from Firebase Realtime Database.
 * Must be included AFTER data.js on any page that shows products (category.html, product-detail.html, index.html).
 */
import { db, ref, onValue } from './firebase-config.js';

// Wait for data.js to set window.products, then merge Firebase products
function mergeFirebaseProducts() {
    const customRef = ref(db, 'products/custom');
    const deletedRef = ref(db, 'products/deleted');
    const stockRef = ref(db, 'products/stockStatus');

    // Load deleted codes first, then custom products, then stock overrides
    let deletedCodes = {};
    let stockOverrides = {};
    let customProducts = {};

    let deletedLoaded = false;
    let stockLoaded = false;
    let customLoaded = false;

    function tryApply() {
        if (!deletedLoaded || !stockLoaded || !customLoaded) return;

        const products = window.products || {};

        // 1. Remove deleted built-in products
        const deletedKeys = Object.keys(deletedCodes);
        for (const cat in products) {
            products[cat] = products[cat].filter(p => !deletedKeys.includes(p.code));
        }

        // 2. Merge Firebase custom products
        Object.values(customProducts).forEach(prod => {
            const cat = prod.category;
            if (!products[cat]) products[cat] = [];
            // Avoid duplicates
            if (!products[cat].some(p => p.code === prod.code)) {
                products[cat].unshift(prod);
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
    }, { onlyOnce: false });

    onValue(stockRef, (snap) => {
        stockOverrides = snap.exists() ? snap.val() : {};
        stockLoaded = true;
        tryApply();
    }, { onlyOnce: false });

    onValue(customRef, (snap) => {
        customProducts = snap.exists() ? snap.val() : {};
        customLoaded = true;
        tryApply();
    }, { onlyOnce: false });
}

mergeFirebaseProducts();
