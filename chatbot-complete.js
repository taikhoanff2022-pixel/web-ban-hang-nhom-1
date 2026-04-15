// COMPLETE Working Chatbot - Copy to js/chatbot.js if needed
(function() {
    'use strict';
    
    console.log('🎯 Complete Chatbot loading...');
    
    function initChat() {
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatToggle = document.getElementById('chat-toggle');
        
        if (!chatMessages || !chatInput || !chatSend || !chatToggle) {
            console.error('Chat elements not found');
            return false;
        }
        
        console.log('✅ All chat elements found');
        
        let messages = [];
        let products = window.products || [];
        
        function addMsg(text, sender = 'bot') {
            const msg = document.createElement('div');
            msg.className = sender === 'user' ? 'message user-message' : 'message bot-message';
            msg.innerHTML = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            messages.push({text, sender, time: Date.now()});
        }
        
        function simpleReply(input) {
            const lower = input.toLowerCase();
            
            if (lower.includes('giá') || lower.includes('price')) {
                return '💰 Giá HOT:<br>iPhone 15 Pro Max: 25.9tr<br>MacBook M3 Pro: 48.9tr<br>PS5 Slim: 14.9tr<br><br>Hỏi tên sp cụ thể nhé!';
            }
            
            if (lower.includes('iphone') || lower.includes('samsung') || lower.includes('macbook')) {
                return getProductReply(lower);
            }
            
            if (lower.includes('chào') || lower.includes('hello')) {
                return 'Xin chào bạn! 👋 ShopVN Pro đây. Hỏi giá sp hoặc vấn đề gì nhé!';
            }
            
            if (lower.includes('giỏ') || lower.includes('cart') || lower.includes('mua')) {
                return '🛒 Click nút + thêm giỏ → "Giỏ Hàng" → Checkout COD freeship!';
            }
            
            if (lower.includes('trực tiếp') || lower.includes('nhân viên')) {
                return '<span class="agent-avatar">👨‍💼</span><strong>Minh - Nhân viên</strong><br>Chào bạn! Hỗ trợ trực tiếp đây ạ!';
            }
            
            return '🤔 Tôi hiểu bạn muốn hỏi gì đó! Thử: "giá iPhone", "giỏ hàng", "chat trực tiếp"?';
        }
        
        function getProductReply(query) {
            const product = products.find(p => p.name.toLowerCase().includes(query));
            if (product) {
                return `<strong>${product.name}</strong><br>💰 ${formatPrice(product.price)}<br>${product.description}`;
            }
            return 'Sản phẩm đó shop có! Kiểm tra danh sách hoặc hỏi tên chính xác nhé 🔥';
        }
        
        function formatPrice(p) {
            return new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(p);
        }
        
        chatSend.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (!text) return;
            
            addMsg(text, 'user');
            chatInput.value = '';
            
            setTimeout(() => {
                const reply = simpleReply(text);
                addMsg(reply);
            }, 500 + Math.random() * 800);
        });
        
        chatInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') chatSend.click();
        });
        
        chatToggle.addEventListener('click', () => {
            if (chatModal.style.display === 'block') {
                chatModal.style.display = 'none';
            } else {
                chatModal.style.display = 'block';
                chatInput.focus();
                addMsg('Chào bạn! ShopVN Pro chat đây. Hỏi mình bất cứ gì! 😊');
            }
        });
        
        console.log('✅ Simple Chatbot ACTIVE');
        return true;
    }
    
    // Load immediately and retry if needed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }
    
})();

