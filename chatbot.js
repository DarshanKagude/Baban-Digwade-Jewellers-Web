/**
 * ==========================================================================
 * BABAN DIGWADE JEWELLERS - AI VIRTUAL ASSISTANT CHATBOT (chatbot.js)
 * Official boutique: bdjewels.co.in | Since 1983
 * ==========================================================================
 */

(function () {
    'use strict';

    // Store metadata & configuration
    const BOT_CONFIG = {
        name: 'BDJ Suvarna Assistant',
        brand: 'Baban Digwade Jewellers',
        phone: '918390907528',
        address: 'Mandpe Galli Bazarpeth Line, Pattan Kodoli, Kolhapur',
        mapsUrl: 'https://www.google.com/maps/dir//Baban+Digwade+Jewellers+Pattan+Kodoli',
        timing: '10:00 AM – 8:30 PM (Open 7 Days)',
        soundEnabled: true
    };

    // Chatbot state
    let isOpen = false;
    let messageHistory = [];
    const STORAGE_KEY = 'bdj_chat_history_v1';

    // Web Audio Sound Chime Generator (No external audio file required)
    function playChime(type = 'receive') {
        if (!BOT_CONFIG.soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'receive') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else if (type === 'send') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            }
        } catch (e) {
            // Audio context not allowed until user gesture or unsupported
        }
    }

    // Initialize UI Markup
    function injectChatbotDOM() {
        if (document.getElementById('bdj-chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'bdj-chatbot-container';
        container.className = 'bdj-chatbot-wrapper';
        container.innerHTML = `
            <!-- Chatbot Teaser Bubble -->
            <div id="bdj-chat-teaser" class="bdj-chat-teaser">
                <span class="bdj-teaser-close" id="bdj-teaser-close" title="Dismiss">&times;</span>
                <div class="bdj-teaser-text">
                    <div class="bdj-teaser-title">✨ <strong>BDJ Assistant</strong></div>
                    <div>Check today's Gold Rates, Schemes & Jewellery!</div>
                </div>
            </div>

            <!-- Floating Launcher Trigger Button -->
            <button id="bdj-chat-launcher" class="bdj-chat-launcher" aria-label="Open BDJ Jewellery Assistant">
                <div class="launcher-glow"></div>
                <div class="launcher-icon-open">
                    <i class="fas fa-gem"></i>
                    <span class="launcher-badge" id="bdj-launcher-badge">1</span>
                </div>
                <div class="launcher-icon-close">
                    <i class="fas fa-times"></i>
                </div>
            </button>

            <!-- Chat Window Modal -->
            <div id="bdj-chat-window" class="bdj-chat-window" aria-hidden="true">
                <!-- Header -->
                <div class="bdj-chat-header">
                    <div class="bdj-header-avatar">
                        <img src="images/BDJ.png" alt="BDJ Logo" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=100'">
                        <span class="online-indicator"></span>
                    </div>
                    <div class="bdj-header-info">
                        <h3>BDJ Concierge</h3>
                        <p class="status-text"><i class="fas fa-circle live-dot"></i> Live Gold & Jewellery Assistant</p>
                    </div>
                    <div class="bdj-header-actions">
                        <button id="bdj-btn-sound" class="header-action-btn" title="Toggle Sound">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button id="bdj-btn-clear" class="header-action-btn" title="Clear Chat History">
                            <i class="fas fa-redo-alt"></i>
                        </button>
                        <button id="bdj-btn-close" class="header-action-btn" title="Close Chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Live Rate Bar Ticker -->
                <div class="bdj-rate-ticker" id="bdj-rate-ticker">
                    <div class="ticker-content" id="bdj-ticker-text">
                        <i class="fas fa-chart-line"></i> Loading today's live gold rates...
                    </div>
                </div>

                <!-- Messages Container -->
                <div class="bdj-chat-body" id="bdj-chat-messages">
                    <!-- Dynamic Messages will be rendered here -->
                </div>

                <!-- Quick Action Suggestion Chips -->
                <div class="bdj-quick-chips" id="bdj-quick-chips">
                    <button class="chip-btn" data-query="rates"><i class="fas fa-chart-line"></i> Today's Rates</button>
                    <button class="chip-btn" data-query="scheme"><i class="fas fa-piggy-bank"></i> 11+1 Gold Scheme</button>
                    <button class="chip-btn" data-query="rings"><i class="fas fa-ring"></i> Rings</button>
                    <button class="chip-btn" data-query="necklaces"><i class="fas fa-gem"></i> Necklaces</button>
                    <button class="chip-btn" data-query="mangalsutra"><i class="fas fa-heart"></i> Mangalsutra</button>
                    <button class="chip-btn" data-query="bangles"><i class="fas fa-circle-notch"></i> Bangles</button>
                    <button class="chip-btn" data-query="silver"><i class="fas fa-coins"></i> Silver</button>
                    <button class="chip-btn" data-query="location"><i class="fas fa-map-marker-alt"></i> Store Location</button>
                    <button class="chip-btn" data-query="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp Help</button>
                </div>

                <!-- Input Footer -->
                <form class="bdj-chat-footer" id="bdj-chat-form">
                    <input type="text" id="bdj-chat-input" placeholder="Ask about gold rates, rings, schemes..." autocomplete="off" maxlength="300">
                    <button type="submit" id="bdj-send-btn" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(container);
        bindChatbotEvents();
        updateTicker();
        loadHistoryOrGreet();
    }

    // Format Prices Helpers
    function getLivePrices() {
        const p = window.prices || {};
        return {
            gold18k: p.gold18k || 46000,
            gold20k: p.gold20k || 52000,
            gold22k: p.gold22k || 58450,
            gold24k: p.gold24k || 63760,
            silver: p.silver || 74.2,
            lastUpdate: p.lastUpdate || 'Today'
        };
    }

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    // Update live top rate ticker inside the chat window
    function updateTicker() {
        const ticker = document.getElementById('bdj-ticker-text');
        if (!ticker) return;
        const p = getLivePrices();
        const gold22kPer10g = formatCurrency(p.gold22k);
        const gold24kPer10g = formatCurrency(p.gold24k);
        const silverPer10g = formatCurrency(p.silver * 10);
        ticker.innerHTML = `
            <span><strong>22K:</strong> ${gold22kPer10g}/10g</span> &bull; 
            <span><strong>24K:</strong> ${gold24kPer10g}/10g</span> &bull; 
            <span><strong>Silver:</strong> ${silverPer10g}/10g</span>
        `;
    }

    // Render Messages to DOM
    function renderMessage(msg, scroll = true) {
        const msgContainer = document.getElementById('bdj-chat-messages');
        if (!msgContainer) return;

        const row = document.createElement('div');
        row.className = `bdj-msg-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`;

        const timeStr = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (msg.sender === 'bot') {
            row.innerHTML = `
                <div class="msg-avatar">
                    <img src="images/BDJ.png" alt="BDJ" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=100'">
                </div>
                <div class="msg-content-wrapper">
                    <div class="msg-bubble bot-bubble">
                        ${msg.html}
                    </div>
                    <span class="msg-time">${timeStr}</span>
                </div>
            `;
        } else {
            row.innerHTML = `
                <div class="msg-content-wrapper">
                    <div class="msg-bubble user-bubble">
                        ${escapeHtml(msg.text)}
                    </div>
                    <span class="msg-time">${timeStr}</span>
                </div>
            `;
        }

        msgContainer.appendChild(row);

        if (scroll) {
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Show dynamic typing indicator while generating response
    function showTypingIndicator() {
        const msgContainer = document.getElementById('bdj-chat-messages');
        if (!msgContainer) return null;

        const typingElem = document.createElement('div');
        typingElem.id = 'bdj-typing-indicator';
        typingElem.className = 'bdj-msg-row bot-row';
        typingElem.innerHTML = `
            <div class="msg-avatar">
                <img src="images/BDJ.png" alt="BDJ">
            </div>
            <div class="msg-content-wrapper">
                <div class="msg-bubble bot-bubble typing-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        msgContainer.appendChild(typingElem);
        msgContainer.scrollTop = msgContainer.scrollHeight;
        return typingElem;
    }

    function removeTypingIndicator() {
        const elem = document.getElementById('bdj-typing-indicator');
        if (elem) elem.remove();
    }

    // Greet user or load past session
    function loadHistoryOrGreet() {
        const msgContainer = document.getElementById('bdj-chat-messages');
        if (!msgContainer) return;
        msgContainer.innerHTML = '';

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                messageHistory = JSON.parse(saved);
                if (Array.isArray(messageHistory) && messageHistory.length > 0) {
                    messageHistory.forEach(m => renderMessage(m, false));
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                    return;
                }
            }
        } catch (e) {
            console.error('Could not load chat history:', e);
        }

        // Default Welcome Message
        const p = getLivePrices();
        const welcomeHtml = `
            <p>🙏 <strong>Namaste & Welcome to Baban Digwade Jewellers!</strong></p>
            <p>I am your 24/7 personal jewellery concierge. How may I assist you today?</p>
            
            <div class="bot-card-highlight">
                <div class="gold-rate-quick">
                    <div><i class="fas fa-coins text-gold"></i> <strong>22K Gold:</strong> ${formatCurrency(p.gold22k)} / 10g</div>
                    <div><i class="fas fa-certificate text-gold"></i> <strong>24K Pure:</strong> ${formatCurrency(p.gold24k)} / 10g</div>
                </div>
            </div>
            
            <p style="font-size: 0.88rem; margin-top: 8px;">Tap any quick option below or type your question:</p>
        `;

        const welcomeMsg = {
            sender: 'bot',
            html: welcomeHtml,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        messageHistory = [welcomeMsg];
        saveHistory();
        renderMessage(welcomeMsg);
    }

    function saveHistory() {
        try {
            // Keep last 30 messages to avoid large storage
            if (messageHistory.length > 30) {
                messageHistory = messageHistory.slice(messageHistory.length - 30);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
        } catch (e) { }
    }

    // Toggle Chat Window
    function toggleChat(forceState) {
        const chatWin = document.getElementById('bdj-chat-window');
        const launcher = document.getElementById('bdj-chat-launcher');
        const teaser = document.getElementById('bdj-chat-teaser');
        const badge = document.getElementById('bdj-launcher-badge');

        if (!chatWin || !launcher) return;

        isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

        if (isOpen) {
            chatWin.classList.add('active');
            launcher.classList.add('active');
            chatWin.setAttribute('aria-hidden', 'false');
            if (teaser) teaser.style.display = 'none';
            if (badge) badge.style.display = 'none';
            document.getElementById('bdj-chat-input')?.focus();

            const msgContainer = document.getElementById('bdj-chat-messages');
            if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
        } else {
            chatWin.classList.remove('active');
            launcher.classList.remove('active');
            chatWin.setAttribute('aria-hidden', 'true');
        }
    }

    // Knowledge Engine & Natural Language Query Processor
    function processUserQuery(queryText) {
        const q = queryText.toLowerCase().trim();
        const p = getLivePrices();

        // 1. RATES & PRICES (English / Marathi / Hindi)
        if (
            q.includes('rate') || q.includes('price') || q.includes('bhav') || q.includes('bhav kay') ||
            q.includes('today') || q.includes('gold price') || q.includes('silver rate') ||
            q.includes('sona') || q.includes('chandi') || q.includes('tola') || q.includes('22k') ||
            q.includes('24k') || q.includes('18k') || q.includes('cost')
        ) {
            const gold18kPer1g = formatCurrency(p.gold18k / 10);
            const gold20kPer1g = formatCurrency(p.gold20k / 10);
            const gold22kPer1g = formatCurrency(p.gold22k / 10);
            const gold24kPer1g = formatCurrency(p.gold24k / 10);

            const gold18kPer10g = formatCurrency(p.gold18k);
            const gold20kPer10g = formatCurrency(p.gold20k);
            const gold22kPer10g = formatCurrency(p.gold22k);
            const gold24kPer10g = formatCurrency(p.gold24k);

            const silverPer1g = formatCurrency(p.silver);
            const silverPer10g = formatCurrency(p.silver * 10);
            const silverPer1kg = formatCurrency(p.silver * 1000);

            return `
                <div class="bot-card">
                    <div class="bot-card-title"><i class="fas fa-chart-line text-gold"></i> Today's Live Rates (${p.lastUpdate})</div>
                    <table class="bot-rates-table">
                        <thead>
                            <tr>
                                <th>Purity / Metal</th>
                                <th>Per Gram</th>
                                <th>Per 10g (Tola)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>24KT Gold</strong> (Pure 99.9%)</td>
                                <td>${gold24kPer1g}</td>
                                <td><span class="highlight-rate">${gold24kPer10g}</span></td>
                            </tr>
                            <tr class="gold-recommended">
                                <td><strong>22KT Gold</strong> (916 Hallmark)</td>
                                <td>${gold22kPer1g}</td>
                                <td><span class="highlight-rate">${gold22kPer10g}</span></td>
                            </tr>
                            <tr>
                                <td><strong>20KT Gold</strong></td>
                                <td>${gold20kPer1g}</td>
                                <td>${gold20kPer10g}</td>
                            </tr>
                            <tr>
                                <td><strong>18KT Gold</strong> (Diamond Base)</td>
                                <td>${gold18kPer1g}</td>
                                <td>${gold18kPer10g}</td>
                            </tr>
                            <tr>
                                <td><strong>Silver 999</strong></td>
                                <td>${silverPer1g}/g</td>
                                <td>${silverPer10g} (1kg: ${silverPer1kg})</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="bot-rate-note"><i class="fas fa-info-circle"></i> *Rates excluding 3% GST. 100% BIS Hallmarked 916 Jewellery guarantee.</div>
                    <div class="bot-actions-inline">
                        <a href="rate.html" class="bot-btn-gold">View Full Rate History <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        }

        // 2. GOLD SCHEMES (11+1 Bonus Plan / Monthly Dhanvarsha / Bachat Yojana)
        if (
            q.includes('scheme') || q.includes('11+1') || q.includes('monthly') || q.includes('plan') ||
            q.includes('bachat') || q.includes('saving') || q.includes('installment') || q.includes('dhanvarsha')
        ) {
            return `
                <div class="bot-card">
                    <div class="bot-card-title"><i class="fas fa-piggy-bank text-gold"></i> BDJ 11+1 Monthly Gold Savings Scheme</div>
                    <p>Our most trusted savings plan! Pay 11 monthly installments, and <strong>BDJ pays the 12th installment bonus!</strong></p>
                    
                    <div class="scheme-calc-box">
                        <label><strong>Quick Scheme Calculator:</strong></label>
                        <div class="scheme-chips-container">
                            <button class="scheme-val-btn" onclick="window.BDJChatbot.calcScheme(1000)">₹1,000 / mo</button>
                            <button class="scheme-val-btn" onclick="window.BDJChatbot.calcScheme(2000)">₹2,000 / mo</button>
                            <button class="scheme-val-btn active-val" onclick="window.BDJChatbot.calcScheme(3000)">₹3,000 / mo</button>
                            <button class="scheme-val-btn" onclick="window.BDJChatbot.calcScheme(5000)">₹5,000 / mo</button>
                            <button class="scheme-val-btn" onclick="window.BDJChatbot.calcScheme(10000)">₹10,000 / mo</button>
                        </div>
                        <div id="bdj-scheme-calc-result" class="scheme-result-box">
                            <div class="result-row"><span>You Pay (11 Months):</span> <strong>₹33,000</strong></div>
                            <div class="result-row bonus-row"><span>BDJ Bonus (12th Month):</span> <strong>+ ₹3,000 FREE</strong></div>
                            <div class="result-row total-row"><span>Total Jewellery Value:</span> <strong class="text-gold">₹36,000</strong></div>
                        </div>
                    </div>

                    <ul class="bot-bullet-list">
                        <li><i class="fas fa-check-circle text-gold"></i> 100% Bonus installment credited by Baban Digwade Jewellers.</li>
                        <li><i class="fas fa-check-circle text-gold"></i> Redeemable on pure 22KT Gold, Silver & Diamond ornaments.</li>
                        <li><i class="fas fa-check-circle text-gold"></i> Zero making charge perks & exclusive festival priority.</li>
                    </ul>

                    <div class="bot-actions-inline">
                        <a href="schemes.html" class="bot-btn-gold">Explore All Schemes <i class="fas fa-arrow-right"></i></a>
                        <a href="https://wa.me/918390907528?text=Hello%20BDJ,%20I%20want%20to%20enroll%20in%20the%2011%2B1%20Gold%20Savings%20Scheme." target="_blank" class="bot-btn-whatsapp"><i class="fab fa-whatsapp"></i> Enroll on WhatsApp</a>
                    </div>
                </div>
            `;
        }

        // 3. STORE LOCATION, TIMINGS, CONTACT, ADDRESS (English / Marathi)
        if (
            q.includes('address') || q.includes('location') || q.includes('where') || q.includes('direction') ||
            q.includes('map') || q.includes('timing') || q.includes('time') || q.includes('open') ||
            q.includes('close') || q.includes('pattan kodoli') || q.includes('kuthe') || q.includes('phone') ||
            q.includes('contact') || q.includes('number') || q.includes('kolhapur')
        ) {
            return `
                <div class="bot-card">
                    <div class="bot-card-title"><i class="fas fa-store text-gold"></i> Visit Baban Digwade Jewellers</div>
                    <p><strong>📍 Showroom Address:</strong><br>
                    Mandpe Galli Bazarpeth Line, Pattan Kodoli, Maharashtra 416202</p>
                    
                    <p><strong>🕒 Showroom Timings:</strong><br>
                    10:00 AM – 8:30 PM (Open all 7 days of the week)</p>
                    
                    <p><strong>📞 Contact & WhatsApp:</strong><br>
                    +91 8390907528 &bull; babandigwade1983@gmail.com</p>

                    <div class="bot-actions-inline">
                        <a href="${BOT_CONFIG.mapsUrl}" target="_blank" class="bot-btn-gold"><i class="fas fa-directions"></i> Get Google Maps Directions</a>
                        <a href="https://wa.me/${BOT_CONFIG.phone}" target="_blank" class="bot-btn-whatsapp"><i class="fab fa-whatsapp"></i> Message on WhatsApp</a>
                    </div>
                </div>
            `;
        }

        // 4. PRODUCT CATALOG SEARCH & RECOMMENDATIONS
        const productSearchKeywords = [
            { key: 'ring', label: 'Rings', sub: 'rings', type: 'gold', query: ['ring', 'angthi', 'anguthi', 'challa'] },
            { key: 'necklace', label: 'Necklaces & Chokers', sub: 'neckless', type: 'gold', query: ['necklace', 'neckless', 'haar', 'choker', 'tanmani', 'rani haar'] },
            { key: 'bangle', label: 'Bangles & Kadas', sub: 'bangales', type: 'gold', query: ['bangle', 'bangadi', 'kangan', 'kada', 'patlya', 'tode'] },
            { key: 'mangalsutra', label: 'Mangalsutras', sub: 'mangalsutr', type: 'gold', query: ['mangalsutra', 'mangalsutr', 'tanmaniya', 'vati'] },
            { key: 'earring', label: 'Earrings & Jhumkas', sub: 'jhumka', type: 'gold', query: ['earring', 'jhumka', 'jhumki', 'kudi', 'bali', 'stud'] },
            { key: 'chain', label: 'Gold Chains', sub: 'chain', type: 'gold', query: ['chain', 'chains', 'goph', 'dokiya'] },
            { key: 'silver', label: 'Silver Articles & Ornaments', sub: '', type: 'silver', query: ['silver', 'chandi', 'payal', 'painjan', 'silver coin', 'bartan', 'murti'] },
            { key: 'gifting', label: 'Gifting Articles & Coins', sub: '', type: 'gifting', query: ['gift', 'gifting', 'coin', 'laxmi coin', 'present'] },
            { key: 'bridal', label: 'Bridal Wedding Collection', sub: '', type: 'collections', query: ['bridal', 'wedding', 'lagna', 'dulhan', 'vivah'] }
        ];

        let matchedCategory = null;
        for (const item of productSearchKeywords) {
            if (item.query.some(k => q.includes(k))) {
                matchedCategory = item;
                break;
            }
        }

        if (matchedCategory) {
            return generateProductCardsResponse(matchedCategory);
        }

        // Generic collection queries
        if (q.includes('collection') || q.includes('jewellery') || q.includes('ornament') || q.includes('catalogue') || q.includes('variety') || q.includes('designs')) {
            return `
                <div class="bot-card">
                    <div class="bot-card-title"><i class="fas fa-gem text-gold"></i> Explore Our Handcrafted Collections</div>
                    <p>Since 1983, BDJ offers exquisite 916 Hallmarked Gold, Silver & Diamond jewellery:</p>
                    
                    <div class="bot-category-grid">
                        <a href="category.html?type=gold&subCategory=rings" class="cat-pill"><i class="fas fa-ring"></i> Gold Rings</a>
                        <a href="category.html?type=gold&subCategory=neckless" class="cat-pill"><i class="fas fa-gem"></i> Necklaces</a>
                        <a href="category.html?type=gold&subCategory=bangales" class="cat-pill"><i class="fas fa-circle-notch"></i> Bangles</a>
                        <a href="category.html?type=gold&subCategory=mangalsutr" class="cat-pill"><i class="fas fa-heart"></i> Mangalsutras</a>
                        <a href="category.html?type=gold&subCategory=jhumka" class="cat-pill"><i class="fas fa-star"></i> Jhumkas</a>
                        <a href="category.html?type=silver" class="cat-pill"><i class="fas fa-coins"></i> Silver Items</a>
                        <a href="category.html?type=collections" class="cat-pill"><i class="fas fa-crown"></i> Heritage Bridal</a>
                    </div>
                    
                    <div class="bot-actions-inline" style="margin-top: 10px;">
                        <a href="category.html?type=collections" class="bot-btn-gold">View Full Catalogue <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        }

        // 5. HALLMARK, PURITY & CUSTOM ORDERS / EXCHANGE
        if (q.includes('purity') || q.includes('hallmark') || q.includes('916') || q.includes('bis') || q.includes('exchange') || q.includes('custom') || q.includes('order')) {
            return `
                <div class="bot-card">
                    <div class="bot-card-title"><i class="fas fa-certificate text-gold"></i> 100% BIS Hallmarked Purity Guarantee</div>
                    <p>At <strong>Baban Digwade Jewellers</strong>, every gold ornament is stamped with official <strong>BIS 916 HUID Hallmarking</strong>, guaranteeing verified purity.</p>
                    
                    <ul class="bot-bullet-list">
                        <li><strong>Old Gold Exchange:</strong> Get 100% fair valuation & best rate for your old gold jewellery.</li>
                        <li><strong>Custom Jewellery Orders:</strong> Bring any design or photo from Instagram/Pinterest, and our master karigars will craft it to perfection.</li>
                        <li><strong>Free Cleaning & Polishing:</strong> Lifetime complimentary maintenance for BDJ customers.</li>
                    </ul>

                    <div class="bot-actions-inline">
                        <a href="https://wa.me/${BOT_CONFIG.phone}?text=Hello%20BDJ,%20I%20want%20to%20inquire%20about%20custom%20jewellery%20design." target="_blank" class="bot-btn-whatsapp"><i class="fab fa-whatsapp"></i> Inquire Custom Design</a>
                    </div>
                </div>
            `;
        }

        // 6. GREETINGS & CASUAL
        if (q.includes('hi') || q.includes('hello') || q.includes('namaste') || q.includes('hey') || q.includes('shree') || q.includes('good morning') || q.includes('good evening')) {
            return `
                <p>🙏 <strong>Namaste!</strong></p>
                <p>How may I help you today at Baban Digwade Jewellers? You can check <strong>Live Gold Rates</strong>, explore <strong>Rings & Necklaces</strong>, or calculate your <strong>11+1 Monthly Scheme</strong> returns!</p>
            `;
        }

        // 7. DEFAULT / FALLBACK SMART RESPONSE
        return `
            <div class="bot-card">
                <p>I would be delighted to assist you with that!</p>
                <p>Here are the most popular inquiries for <strong>Baban Digwade Jewellers</strong>:</p>
                <div class="bot-category-grid">
                    <button class="cat-pill" onclick="window.BDJChatbot.sendPredefined('Today gold rate')"><i class="fas fa-chart-line"></i> Today's Rates</button>
                    <button class="cat-pill" onclick="window.BDJChatbot.sendPredefined('Tell me about 11+1 scheme')"><i class="fas fa-piggy-bank"></i> Monthly Scheme</button>
                    <button class="cat-pill" onclick="window.BDJChatbot.sendPredefined('Show gold rings')"><i class="fas fa-ring"></i> Rings & Bangles</button>
                    <button class="cat-pill" onclick="window.BDJChatbot.sendPredefined('Where is store located?')"><i class="fas fa-map-marker-alt"></i> Store Location</button>
                </div>
                <p style="font-size: 0.85rem; margin-top: 10px; color: #666;">Or message directly with our showroom team on WhatsApp:</p>
                <div class="bot-actions-inline">
                    <a href="https://wa.me/${BOT_CONFIG.phone}?text=${encodeURIComponent('Hello BDJ, I have an inquiry: ' + queryText)}" target="_blank" class="bot-btn-whatsapp">
                        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
                    </a>
                </div>
            </div>
        `;
    }

    // Generate Rich Product Cards
    function generateProductCardsResponse(matched) {
        let prods = [];
        const allProducts = window.products || {};

        if (matched.type === 'gold' && Array.isArray(allProducts.gold)) {
            prods = allProducts.gold.filter(p => {
                if (matched.sub) {
                    return p.subCategory && p.subCategory.toLowerCase() === matched.sub.toLowerCase();
                }
                return true;
            });
        } else if (matched.type === 'silver' && Array.isArray(allProducts.silver)) {
            prods = allProducts.silver;
        } else if (matched.type === 'collections' && Array.isArray(allProducts.gold)) {
            prods = allProducts.gold.slice(0, 4);
        }

        // Fallback if empty
        if (!prods || prods.length === 0) {
            if (Array.isArray(allProducts.gold)) {
                prods = allProducts.gold.slice(0, 3);
            }
        }

        // Take top 3 for clean display inside chat
        const displayItems = prods.slice(0, 3);
        const categoryUrl = matched.sub ? `category.html?type=${matched.type}&subCategory=${matched.sub}` : `category.html?type=${matched.type}`;

        let cardsHtml = displayItems.map(item => {
            const purity = item.details?.purity || '22KT';
            const weight = item.weight ? ` &bull; ${item.weight}` : '';
            return `
                <div class="bot-prod-card" onclick="window.location.href='product-detail.html?code=${encodeURIComponent(item.code)}'">
                    <img src="${item.img}" alt="${escapeHtml(item.name)}" class="bot-prod-img" onerror="this.src='https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400'">
                    <div class="bot-prod-info">
                        <div class="bot-prod-name">${escapeHtml(item.name)}</div>
                        <div class="bot-prod-meta">${purity}${weight}</div>
                        <div class="bot-prod-code">Code: ${escapeHtml(item.code)}</div>
                    </div>
                    <div class="bot-prod-arrow"><i class="fas fa-chevron-right"></i></div>
                </div>
            `;
        }).join('');

        return `
            <div class="bot-card">
                <div class="bot-card-title"><i class="fas fa-gem text-gold"></i> Featured ${escapeHtml(matched.label)}</div>
                <div class="bot-prod-list">
                    ${cardsHtml}
                </div>
                <div class="bot-actions-inline" style="margin-top: 10px;">
                    <a href="${categoryUrl}" class="bot-btn-gold">Browse All ${escapeHtml(matched.label)} <i class="fas fa-arrow-right"></i></a>
                    <a href="https://wa.me/${BOT_CONFIG.phone}?text=Hello%20BDJ,%20I%20am%20interested%20in%20viewing%20more%20${encodeURIComponent(matched.label)}." target="_blank" class="bot-btn-whatsapp"><i class="fab fa-whatsapp"></i> Inquire</a>
                </div>
            </div>
        `;
    }

    // Send user message
    function handleUserSend(text) {
        if (!text || !text.trim()) return;
        const cleanText = text.trim();

        // 1. Render User Message
        const userMsg = {
            sender: 'user',
            text: cleanText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        messageHistory.push(userMsg);
        renderMessage(userMsg);
        playChime('send');

        // Clear input
        const input = document.getElementById('bdj-chat-input');
        if (input) input.value = '';

        // 2. Show Typing indicator
        const typingElem = showTypingIndicator();

        // 3. Process Bot Response with slight natural delay
        setTimeout(() => {
            removeTypingIndicator();
            const botHtml = processUserQuery(cleanText);
            const botMsg = {
                sender: 'bot',
                html: botHtml,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            messageHistory.push(botMsg);
            saveHistory();
            renderMessage(botMsg);
            playChime('receive');
        }, 450);
    }

    // Bind all chatbot DOM events
    function bindChatbotEvents() {
        const launcher = document.getElementById('bdj-chat-launcher');
        const closeBtn = document.getElementById('bdj-btn-close');
        const clearBtn = document.getElementById('bdj-btn-clear');
        const soundBtn = document.getElementById('bdj-btn-sound');
        const teaserClose = document.getElementById('bdj-teaser-close');
        const teaser = document.getElementById('bdj-chat-teaser');
        const form = document.getElementById('bdj-chat-form');
        const chipsContainer = document.getElementById('bdj-quick-chips');

        // Toggle launcher
        launcher?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChat();
        });

        // Close button
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChat(false);
        });

        // Clear button
        clearBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.removeItem(STORAGE_KEY);
            messageHistory = [];
            loadHistoryOrGreet();
        });

        // Sound toggle
        soundBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            BOT_CONFIG.soundEnabled = !BOT_CONFIG.soundEnabled;
            soundBtn.innerHTML = BOT_CONFIG.soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            soundBtn.title = BOT_CONFIG.soundEnabled ? 'Mute Sound' : 'Enable Sound';
        });

        // Teaser click
        teaser?.addEventListener('click', (e) => {
            if (e.target.id === 'bdj-teaser-close') {
                teaser.style.display = 'none';
                return;
            }
            toggleChat(true);
        });

        teaserClose?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (teaser) teaser.style.display = 'none';
        });

        // Form submit
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('bdj-chat-input');
            if (input) handleUserSend(input.value);
        });

        // Quick action chips
        chipsContainer?.addEventListener('click', (e) => {
            const btn = e.target.closest('.chip-btn');
            if (!btn) return;
            const queryType = btn.dataset.query;
            let queryText = btn.textContent.trim();

            if (queryType === 'rates') queryText = "Today's Gold & Silver Rates";
            else if (queryType === 'scheme') queryText = "Tell me about the 11+1 Monthly Gold Scheme";
            else if (queryType === 'rings') queryText = "Show me Gold Rings";
            else if (queryType === 'necklaces') queryText = "Show me Gold Necklaces";
            else if (queryType === 'mangalsutra') queryText = "Show me Gold Mangalsutras";
            else if (queryType === 'bangles') queryText = "Show me Gold Bangles";
            else if (queryType === 'silver') queryText = "Show me Silver Articles";
            else if (queryType === 'location') queryText = "Where is your store located and what are timings?";
            else if (queryType === 'whatsapp') {
                window.open(`https://wa.me/${BOT_CONFIG.phone}?text=Hello%20BDJ,%20I%20have%20an%20inquiry%20regarding%20jewellery.`, '_blank');
                return;
            }

            handleUserSend(queryText);
        });

        // Listen for Realtime Rates Updates
        window.addEventListener('ratesUpdated', () => {
            updateTicker();
        });

        // Auto show teaser after 3 seconds if not opened
        setTimeout(() => {
            if (!isOpen && teaser) {
                teaser.classList.add('visible');
            }
        }, 3000);
    }

    // Expose global methods for inline interactive buttons inside chat cards
    window.BDJChatbot = {
        open: () => toggleChat(true),
        close: () => toggleChat(false),
        sendPredefined: (text) => handleUserSend(text),
        calcScheme: (monthlyAmt) => {
            const amt = parseInt(monthlyAmt, 10) || 3000;
            const youPay = amt * 11;
            const bonus = amt;
            const total = amt * 12;

            const resElem = document.getElementById('bdj-scheme-calc-result');
            if (resElem) {
                resElem.innerHTML = `
                    <div class="result-row"><span>You Pay (11 Months):</span> <strong>₹${youPay.toLocaleString('en-IN')}</strong></div>
                    <div class="result-row bonus-row"><span>BDJ Bonus (12th Month):</span> <strong>+ ₹${bonus.toLocaleString('en-IN')} FREE</strong></div>
                    <div class="result-row total-row"><span>Total Jewellery Value:</span> <strong class="text-gold">₹${total.toLocaleString('en-IN')}</strong></div>
                `;
            }

            // Update active styling on scheme chips
            const btns = document.querySelectorAll('.scheme-val-btn');
            btns.forEach(b => {
                if (b.textContent.includes(amt.toLocaleString('en-IN'))) {
                    b.classList.add('active-val');
                } else {
                    b.classList.remove('active-val');
                }
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbotDOM);
    } else {
        injectChatbotDOM();
    }

})();
