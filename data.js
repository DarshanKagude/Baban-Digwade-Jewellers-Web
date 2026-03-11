const DEFAULT_COLLECTIONS = ['Bridal', 'Heritage', 'Royal', 'Signature', 'Classic', 'Nature', 'Modern', 'Daily Wear', 'Casual', 'Festive'];

// getCollectionsList is now primarily handled/overridden by product-sync.js
// This remains as a fallback or initial state
window.getCollectionsList = () => {
    return window.customCollections || DEFAULT_COLLECTIONS;
};

let prices = {
    gold18k: 46000,
    gold20k: 52000,
    gold22k: 58450,
    gold24k: 63760,
    silver: 74.2,
    lastUpdate: 'Feb 28, 2026 at 7:31 PM'
};
// Default celebrations (initially empty, admin adds via panel)
let celebrations = [];

// Load persistent prices if they exist
const savedPrices = localStorage.getItem('bdj_prices');
if (savedPrices) {
    try {
        prices = JSON.parse(savedPrices);
    } catch (e) {
        console.error("Error loading saved prices:", e);
    }
}

// Load persistent celebrations
const savedCelebrations = localStorage.getItem('bdj_celebrations');
if (savedCelebrations) {
    try {
        const parsed = JSON.parse(savedCelebrations);
        if (parsed.length > 0) celebrations = parsed;
    } catch (e) {
        console.error("Error loading saved celebrations:", e);
    }
}

// Manageable Promo Banner (Single banner added by admin)
let heroBanner = null;

// Load persistent hero banner
const savedHeroBanner = localStorage.getItem('bdj_hero_banner');
if (savedHeroBanner) {
    try {
        heroBanner = JSON.parse(savedHeroBanner);
    } catch (e) {
        console.error("Error loading saved hero banner:", e);
    }
}


// Define products first
const products = {
    new: [],
    gold: [
        {
            code: 'BDJ-G-101',
            name: 'Traditional Gold Necklace',
            weight: '24.5g',
            subCategory: 'neckless',
            img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Heritage' }
        },
        {
            code: 'BDJ-G-102',
            name: 'Kolkata Gold Bangles',
            weight: '18.2g',
            subCategory: 'bangales',
            img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Royal Gold' }
        },
        {
            code: 'BDJ-G-103',
            name: 'Antique Gold Jhumka',
            weight: '12.8g',
            subCategory: 'jhumka',
            img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Antique Finish', collection: 'Classic' }
        },
        {
            code: 'BDJ-G-104',
            name: 'Floral Gold Ring',
            weight: '4.5g',
            subCategory: 'rings',
            img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Daily Wear' }
        },
        {
            code: 'BDJ-G-105',
            name: 'Bridal Gold Mangalsutra',
            weight: '35.2g',
            subCategory: 'mangalsutr',
            img: 'images/gold/511870YAYAA00_2.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-G-106',
            name: 'Classic Gold Earrings',
            weight: '8.4g',
            subCategory: 'earrings',
            img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Classic' }
        },
        {
            code: 'BDJ-G-107',
            name: 'Elegant Gold Mangalsutra',
            weight: '28.5g',
            subCategory: 'mangalsutr',
            img: 'images/gold/mangalsutra.jfif',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Heritage' }
        },
        {
            code: 'BDJ-G-108',
            name: 'Designer Gold Mangalsutra',
            weight: '32.2g',
            subCategory: 'mangalsutr',
            img: 'images/gold/ms 1.jfif',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Royal' }
        },
        {
            code: 'BDJ-G-109',
            name: 'Traditional Gold Mangalsutra (ms 2)',
            weight: '30.5g',
            subCategory: 'mangalsutr',
            img: 'images/gold/ms 2.jfif',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Classic' }
        },
        {
            code: 'BDJ-G-110',
            name: 'Royal Gold Mangalsutra (ms 3)',
            weight: '34.8g',
            subCategory: 'mangalsutr',
            img: 'images/gold/ms 3.jfif',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-G-111',
            name: 'Classic Gold Band (ri 1)',
            weight: '4.2g',
            subCategory: 'rings',
            img: 'images/gold/ri 1.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Daily Wear' }
        },
        {
            code: 'BDJ-G-112',
            name: 'Elegant Gold Ring (ri 2)',
            weight: '5.5g',
            subCategory: 'rings',
            img: 'images/gold/ri 2.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Heritage' }
        },
        {
            code: 'BDJ-G-113',
            name: 'Floral Gold Ring (ri 3)',
            weight: '3.8g',
            subCategory: 'rings',
            img: 'images/gold/ri 3.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Modern' }
        },
        {
            code: 'BDJ-G-114',
            name: 'Designer Gold Ring (ri 4)',
            weight: '6.2g',
            subCategory: 'rings',
            img: 'images/gold/ri 4.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Royal' }
        },
        {
            code: 'BDJ-G-115',
            name: 'Royal Gold Ring (ri 5)',
            weight: '4.8g',
            subCategory: 'rings',
            img: 'images/gold/ri 5.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Classic' }
        },
        {
            code: 'BDJ-G-116',
            name: 'Handcrafted Gold Ring (rings)',
            weight: '5.2g',
            subCategory: 'rings',
            img: 'images/gold/rings.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Signature' }
        },
        {
            code: 'BDJ-G-117',
            name: 'Premium Gold Ring (ri7)',
            weight: '6.5g',
            subCategory: 'rings',
            img: 'images/gold/ri7.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Royal' }
        },
        {
            code: 'BDJ-G-118',
            name: 'Classic Gold Signet (ri8)',
            weight: '7.2g',
            subCategory: 'rings',
            img: 'images/gold/ri8.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Heritage' }
        },
        {
            code: 'BDJ-G-119',
            name: 'Elegant Gold Studs (er1)',
            weight: '3.5g',
            subCategory: 'earrings',
            img: 'images/gold/er1.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Daily Wear' }
        },
        {
            code: 'BDJ-G-120',
            name: 'Floral Gold Earrings (er2)',
            weight: '4.8g',
            subCategory: 'earrings',
            img: 'images/gold/er2.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Nature' }
        },
        {
            code: 'BDJ-G-121',
            name: 'Traditional Gold Jhumkas (er3)',
            weight: '12.5g',
            subCategory: 'earrings',
            img: 'images/gold/er3.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Heritage' }
        },
        {
            code: 'BDJ-G-122',
            name: 'Modern Gold Hoops (er4)',
            weight: '5.2g',
            subCategory: 'earrings',
            img: 'images/gold/er4.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Modern' }
        },
        {
            code: 'BDJ-G-123',
            name: 'Royal Gold Drops (er5)',
            weight: '8.4g',
            subCategory: 'earrings',
            img: 'images/gold/er5.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Royal' }
        },
        {
            code: 'BDJ-G-124',
            name: 'Classic Gold Earrings (er6)',
            weight: '4.2g',
            subCategory: 'earrings',
            img: 'images/gold/er6.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Classic' }
        },
        {
            code: 'BDJ-G-125',
            name: 'Designer Gold Ear-pieces (er7)',
            weight: '6.8g',
            subCategory: 'earrings',
            img: 'images/gold/er7.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Signature' }
        },
        {
            code: 'BDJ-G-126',
            name: 'Antique Gold Earrings (er8)',
            weight: '10.2g',
            subCategory: 'earrings',
            img: 'images/gold/er8.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Antique Finish', collection: 'Classic' }
        }
    ],
    silver: [
        {
            code: 'BDJ-S-201',
            name: 'Ethnic Silver Payal',
            weight: '45.0g',
            price: 4500,
            subCategory: 'payal',
            img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Ethnic' }
        },
        {
            code: 'BDJ-S-202',
            name: 'Silver Oxidised Ring',
            weight: '8.5g',
            price: 1200,
            subCategory: 'rings',
            img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Oxidised Black', collection: 'Modern' }
        },
        {
            code: 'BDJ-S-203',
            name: 'Mens Silver Kada',
            weight: '35.0g',
            price: 3800,
            subCategory: 'kadas',
            img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Heritage' }
        },
        {
            code: 'BDJ-S-204',
            name: 'Silver Jhumka Earrings',
            weight: '15.5g',
            price: 2500,
            subCategory: 'earrings',
            img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Oxidised Finish', collection: 'Classic' }
        },
        {
            code: 'BDJ-S-205',
            name: 'Traditional Silver Bangles',
            weight: '22.0g',
            price: 3200,
            subCategory: 'bangeles',
            img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Traditional' }
        }
    ],
    rings: [
        {
            code: 'BDJ-R-301',
            name: 'Diamond Solitaire Ring',
            weight: '4.2g',
            img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '18KT', color: 'White Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-R-302',
            name: 'Rose Gold Eternity Band',
            weight: '3.8g',
            img: 'https://images.unsplash.com/photo-1598560912005-59463567d341?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '18KT', color: 'Rose Gold', collection: 'Infinity' }
        }
    ],
    collections: [
        {
            code: 'BDJ-W-501',
            name: 'Grand Bridal Choker Set',
            weight: '85.5g',
            subCategory: 'neckless',
            img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-W-502',
            name: 'Royal Heritage Mangalsutra',
            weight: '42.2g',
            subCategory: 'mangalsutr',
            img: 'images/gold/511870YAYAA00_2.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-W-503',
            name: 'Antique Peacock Jhumkas',
            weight: '28.8g',
            subCategory: 'jhumka',
            img: 'images/gold/er3.webp',
            details: { metal: 'Gold', purity: '22KT', color: 'Antique Finish', collection: 'Bridal' }
        },
        {
            code: 'BDJ-W-504',
            name: 'Diamond Wedding Band',
            weight: '5.2g',
            subCategory: 'rings',
            img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '18KT', color: 'White Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-M-401',
            name: 'Exquisite Gold Set',
            weight: '55.0g',
            img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Signature' }
        },
        {
            code: 'BDJ-M-402',
            name: 'Bridal Diamond Collection',
            weight: '120.5g',
            img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '18KT', color: 'White Gold', collection: 'Bridal' }
        },
        {
            code: 'BDJ-M-403',
            name: 'Modern Silver Bracelet',
            weight: '22.4g',
            img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Casual' }
        },
        {
            code: 'BDJ-F-601',
            name: 'Festive Gold Haram',
            weight: '48.5g',
            subCategory: 'neckless',
            img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Festive' }
        },
        {
            code: 'BDJ-F-602',
            name: 'Sparkling Festive Jhumkas',
            weight: '15.2g',
            subCategory: 'jhumka',
            img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Festive' }
        },
        {
            code: 'BDJ-F-603',
            name: 'Festive Special Bangles',
            weight: '24.0g',
            subCategory: 'bangeles',
            img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Gold', purity: '22KT', color: 'Yellow Gold', collection: 'Festive' }
        }
    ],
    gifting: [
        {
            code: 'BDJ-GIF-701',
            name: 'Silver Wedding Set',
            price: 15500,
            subCategory: 'wedding',
            img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Wedding Gifting' }
        },
        {
            code: 'BDJ-GIF-702',
            name: 'Gold Plated Gift Box',
            price: 5200,
            subCategory: 'wedding',
            img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Mixed', purity: 'Gold Plated', color: 'Yellow Gold', collection: 'Wedding Gifting' }
        },
        {
            code: 'BDJ-GIF-703',
            name: 'Decorative Silver Plate',
            price: 8500,
            subCategory: 'wedding',
            img: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=600',
            details: { metal: 'Silver', purity: '92.5 Sterl', color: 'Bright Silver', collection: 'Wedding Gifting' }
        }
    ],
    default: []
};

// Define default schemes
let schemesList = [
    {
        id: 'scheme-1',
        type: 'monthly',
        tagline: 'Legacy Builder',
        name: '11+1 Bonus Plan',
        highlight: 'FREE 1 Month',
        description: 'The smartest way to own jewelry. Pay for 11 months, we pay the 12th.',
        bullets: [
            { icon: 'fas fa-star', text: 'Minimum ₹1,000 per month' },
            { icon: 'fas fa-star', text: 'Pure 22K Gold purchase' },
            { icon: 'fas fa-star', text: 'Zero Making Charges*' },
            { icon: 'fas fa-star', text: 'Birthday Special Discounts' }
        ],
        btnLabel: 'Join Scheme',
        themeColor: 'var(--charcoal)'
    },
    {
        id: 'scheme-2',
        type: 'monthly',
        tagline: 'Wealth Preservation',
        name: 'Weight Accumulator',
        highlight: 'Locked Rates',
        description: 'Beat the market fluctuations by accumulating gold weight.',
        bullets: [
            { icon: 'fas fa-shield-alt', text: 'Buy as little as 0.5g gold' },
            { icon: 'fas fa-shield-alt', text: 'Rates locked at time of payment' },
            { icon: 'fas fa-shield-alt', text: '100% Price transparency' },
            { icon: 'fas fa-shield-alt', text: 'Redeem anytime after 12 months' }
        ],
        btnLabel: 'Start Saving',
        themeColor: 'var(--maroon)'
    },
    {
        id: 'scheme-3',
        type: 'weekly',
        tagline: 'Smart Saver',
        name: 'Weekly Gold Savings',
        highlight: 'Grow Faster',
        description: 'Small weekly savings that lead to big golden moments.',
        bullets: [
            { icon: 'fas fa-calendar-check', text: 'Save from ₹250 per week' },
            { icon: 'fas fa-calendar-check', text: 'Flexible payment options' },
            { icon: 'fas fa-calendar-check', text: 'Bonus rewards on completion' },
            { icon: 'fas fa-calendar-check', text: 'Easy tracking on WhatsApp' }
        ],
        btnLabel: 'Start Weekly Plan',
        themeColor: '#d4af37'
    }
];

// Load persistent schemes
const savedSchemes = localStorage.getItem('bdj_schemes');
if (savedSchemes) {
    try {
        const parsedSchemes = JSON.parse(savedSchemes);
        if (parsedSchemes.length > 0) {
            schemesList = parsedSchemes;
        }
    } catch (e) {
        console.error("Error loading saved schemes:", e);
    }
}


// --- Inventory Overrides Logic ---

// Load persistence data
const customProducts = JSON.parse(localStorage.getItem('bdj_custom_products') || '[]');
const deletedCodes = JSON.parse(localStorage.getItem('bdj_deleted_products') || '[]');
const stockOverrides = JSON.parse(localStorage.getItem('bdj_stock_status') || '{}');

// 1. First, merge custom products into defined products object
customProducts.forEach(prod => {
    const cat = prod.category;
    if (products[cat]) {
        const { category, ...productData } = prod;
        // Check if already exists in target array to prevent duplicates on refresh
        if (!products[cat].some(p => p.code === prod.code)) {
            products[cat].unshift(productData);
        }
    }
});

// 2. Apply Stock Overrides and Deletions
for (const cat in products) {
    // Filter out deleted items
    products[cat] = products[cat].filter(item => !deletedCodes.includes(item.code));

    // Apply stock status
    products[cat].forEach(item => {
        // override status if exists in localStorage, otherwise assume 'in-stock'
        if (stockOverrides[item.code]) {
            item.stockStatus = stockOverrides[item.code];
        } else if (!item.stockStatus) {
            item.stockStatus = 'in-stock';
        }
    });
}
// --- Global Preloader Logic ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.remove();
            }, 500); // Wait for fade-out transition
        }, 3000); // 3 seconds timeout
    }
});

// Expose to window for site-wide use
window.prices = prices;
window.DEFAULT_COLLECTIONS = DEFAULT_COLLECTIONS;
window.getCollectionsList = getCollectionsList;
window.celebrations = celebrations;
window.schemesList = schemesList;
window.heroBanner = heroBanner;
window.products = products;
