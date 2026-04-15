// ADVANCED PROFESSIONAL CHATBOT - Fully Functional
// Features: Fuzzy search, cart sync, Vietnamese NLP, history, typing indicator
(function() {
    'use strict';
    
    console.log('🚀 Advanced Chatbot v2.0 loading...');
    
    class AdvancedChatbot {
        constructor() {
            this.messages = JSON.parse(localStorage.getItem('chatHistory')) || [];
            this.products = window.products || [];
            this.cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.isTyping = false;
            
            this.initElements();
            this.loadHistory();
            this.bindEvents();
            this.addWelcomeMessage();
            console.log('✅ Advanced Chatbot initialized');
        }
        
        initElements() {
            this.chatMessages = document.getElementById('chat-messages');
            this.chatInput = document.getElementById('chat-input');
            this.chatSend = document.getElementById('chat-send');
            this.chatModal = document.getElementById('chat-modal');
            this.chatToggle = document.getElementById('chat-toggle');
            
            if (!this.chatMessages) {
                console.error('❌ Chat elements missing');
                return false;
            }
        }
        
        bindEvents() {
            if (this.chatSend) {
                this.chatSend.onclick = () => this.sendMessage();
            }
            
            if (this.chatInput) {
                this.chatInput.onkeypress = (e) => {
                    if (e.key === 'Enter') this.sendMessage();
                };
            }
            
            if (this.chatToggle) {
                this.chatToggle.onclick = () => {
                    const isVisible = this.chatModal.style.display === 'block';
                    this.chatModal.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) {
                        this.chatInput.focus();
                        if (this.messages.length === 0) this.addWelcomeMessage();
                    }
                };
            }
            
            // Close chat
            document.getElementById('close-chat')?.onclick = () => {
                this.chatModal.style.display = 'none';
            };
            
            // Cart sync observer
            window.addEventListener('storage', (e) => {
                if (e.key === 'cart') {
                    this.cart = JSON.parse(e.newValue || '[]');
                }
            });
        }
        
        addMessage(text, sender = 'bot', isTyping = false) {
            const div = document.createElement('div');
            div.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
            
            if (sender === 'agent') {
                div.className += ' agent-message';
                text = `<span class="agent-avatar">👨‍💼</span><strong>Minh - NV ShopVN</strong><br>${text}`;
            }
            
            div.innerHTML = text;
            this.chatMessages.appendChild(div);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({text, sender, time: Date.now()});
            this.saveHistory();
            
            if (isTyping) this.removeTypingIndicator();
        }
        
        showTypingIndicator() {
            if (this.isTyping) return;
            this.isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            this.chatMessages.appendChild(typingDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
        
        removeTypingIndicator() {
            this.isTyping = false;
            const typing = this.chatMessages.querySelector('.typing-indicator');
            if (typing) typing.remove();
        }
        
        async sendMessage() {
            const text = this.chatInput.value.trim();
            if (!text || this.isTyping) return;
            
            this.chatInput.value = '';
            this.addMessage(text, 'user');
            this.showTypingIndicator();
            
            // Simulate thinking time
            await this.delay(800 + Math.random() * 1200);
            
            const reply = await this.generateReply(text);
            this.addMessage(reply);
        }
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        saveHistory() {
            localStorage.setItem('chatHistory', JSON.stringify(this.messages.slice(-50))); // Keep last 50
        }
        
        loadHistory() {
            this.chatMessages.innerHTML = '';
            this.messages.forEach(msg => {
                this.addMessage(msg.text, msg.sender, false);
            });
        }
        
        generateReply(input) {
            const query = input.toLowerCase().trim();
            
            // Vietnamese intent detection + fuzzy matching
            if (this.hasKeywords(query, ['chào', 'xin chào', 'hello', 'hi'])) {
                return this.welcomeReplies();
            }
            
            if (this.hasKeywords(query, ['giá', 'price', 'bao nhiêu', 'thanh toán'])) {
                return this.priceReplies(query);
            }
            
            if (this.hasKeywords(query, ['tìm', 'search', 'iphone', 'samsung', 'macbook', 'tai nghe'])) {
                return this.productSearch(query);
            }
            
            if (this.hasKeywords(query, ['giỏ', 'cart', 'đặt hàng', 'mua'])) {
                return this.cartReplies(query);
            }
            
            if (this.hasKeywords(query, ['giao', 'ship', 'giao hàng', 'freeship'])) {
                return '🚚 <strong>Giao hàng COD TOÀN QUỐC</strong><br>✅ Freeship nội thành<br>✅ 2-5 ngày ngoại tỉnh<br>✅ Đóng gói kỹ, đổi trả 7 ngày';
            }
            
            if (this.hasKeywords(query, ['trực tiếp', 'nhân viên', 'live', 'agent'])) {
                return this.agentTransfer();
            }
            
            if (this.hasKeywords(query, ['cảm ơn', 'ok', 'bye'])) {
                return '😊 Cảm ơn bạn! Chúc mua sắm vui vẻ! Có gì chat mình nhé! 👋';
            }
            
            // Smart fallback with quick replies
            return `🤔 Hmm, mình hiểu bạn cần hỗ trợ gì đó!<br>
                💡 Thử hỏi: <strong>"giá iPhone"</strong> | <strong>"tìm tai nghe"</strong> | <strong>"giỏ hàng?"</strong><br>
                Hoặc <strong>"chat trực tiếp"</strong> để gặp NV!`;
        }
        
        hasKeywords(text, keywords) {
            return keywords.some(kw => text.includes(kw));
        }
        
        welcomeReplies() {
            return `👋 Chào bạn! <strong>ShopVN Pro</strong> đây ạ!<br>
                🔥 16+ sản phẩm HOT: iPhone, MacBook, PS5...<br>
                💬 Hỏi mình: "giá iPhone", "tìm tai nghe", "giỏ hàng?" nhé!`;
        }
        
        priceReplies(query) {
            if (this.cart.length > 0) {
                return `💰 <strong>Tổng giỏ hàng:</strong> ${window.formatPrice(
                    this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                )}<br>👆 Click "Giỏ Hàng" để xem chi tiết!`;
            }
            return `💰 Giá HOT hôm nay:<br>
                • iPhone 15 Pro Max: 25.9tr<br>
                • MacBook M3 Pro: 48.9tr<br>
                • AirPods Pro 2: 6.9tr<br>
                Hỏi tên sp cụ thể nhé! 🔥`;
        }
        
        productSearch(query) {
            // Fuzzy matching
            const matches = this.products
                .map(p => ({
                    score: this.fuzzyScore(p.name.toLowerCase(), query),
                    product: p
                }))
                .filter(m => m.score > 0.3)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
            
            if (matches.length) {
                return matches.map((m, i) => 
                    `${i+1}. <strong>${m.product.name}</strong><br>💰 ${window.formatPrice(m.product.price)}`
                ).join('<br>') + `<br>👆 Click sản phẩm để xem!`;
            }
            
            return '🔍 Không tìm thấy? Thử tên khác hoặc xem danh sách sản phẩm nhé!';
        }
        
        cartReplies(query) {
            if (this.cart.length === 0) {
                return '🛒 Giỏ hàng trống!<br>👆 Click sản phẩm → "Thêm giỏ" nhé!';
            }
            
            const summary = this.cart.slice(0, 3).map(item => 
                `${item.name} (${item.quantity}x)`
            ).join(', ');
            
            const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            
            return `🛒 <strong>Giỏ hàng (${this.cart.length} sp):</strong><br>
                ${summary}${this.cart.length > 3 ? '...' : ''}<br>
                💰 <strong>Tổng: ${window.formatPrice(total)}</strong><br>
                👆 Click "Giỏ Hàng" để quản lý!`;
        }
        
        agentTransfer() {
            return '🔄 Đang chuyển NV trực tiếp...';
        }
        
        fuzzyScore(str, query) {
            let score = 0;
            query.split(' ').forEach(word => {
                const index = str.indexOf(word);
                if (index > -1) {
                    score += (1 - index / str.length) * word.length / query.length;
                }
            });
            return score;
        }
        
        addWelcomeMessage() {
            if (this.messages.length === 0) {
                this.addMessage(`🎯 <strong>Chatbot ShopVN Pro</strong> sẵn sàng hỗ trợ 24/7!<br>
                    💬 Hỏi giá, tìm sp, giỏ hàng... gì cũng được! 😊`, 'bot');
            }
        }
    }
    
    // Auto-init when DOM ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new AdvancedChatbot());
        } else {
            new AdvancedChatbot();
        }
    }
    
    // Export for testing
    window.AdvancedChatbot = AdvancedChatbot;
    init();
    
})();

