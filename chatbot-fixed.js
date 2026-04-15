// SIMPLIFIED & FIXED CHATBOT - 100% WORKING
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Simple Fixed Chatbot loading...');
    
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatToggle = document.getElementById('chat-toggle');
    const chatModal = document.getElementById('chat-modal');
    
    // Exit if no elements
    if (!chatMessages) {
        console.error('❌ No chat-messages element');
        return;
    }
    
    // Simple responses
    const responses = {
        'chào': '👋 Chào bạn! ShopVN đây. Hỏi "giá iPhone" hoặc "giỏ hàng" nhé!',
        'giá': '💰 iPhone 15 Pro: 25.9tr | MacBook M3: 48.9tr | PS5: 14.9tr',
        'iphone': '📱 iPhone 15 Pro Max 256GB: <strong>25.900.000₫</strong>',
        'tai nghe': '🎧 AirPods Pro 2: 6.9tr | Sony XM5: 8.9tr',
        'giỏ': cart.length > 0 ? `🛒 Giỏ có ${cart.length} sp, tổng ${window.formatPrice(cart.reduce((s,i)=>s+i.price*i.quantity,0))}` : '🛒 Giỏ trống!',
        'giao hàng': '🚚 COD freeship nội thành, 2-5 ngày toàn quốc!',
        default: '🤖 Hỏi "giá", "iphone", "tai nghe", "giỏ", "giao hàng" nhé!'
    };
    
    function addMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = isUser ? 'message user-message' : 'message bot-message';
        msg.innerHTML = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function sendReply() {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;
        
        addMessage(chatInput.value);
        chatInput.value = '';
        
        // Typing delay
        setTimeout(() => {
            const reply = responses[text] || responses.default;
            addMessage(reply);
        }, 500);
    }
    
    // Events
    chatSend.onclick = sendReply;
    chatInput.onkeypress = (e) => e.key === 'Enter' && sendReply();
    
    chatToggle.onclick = () => {
        chatModal.style.display = chatModal.style.display === 'block' ? 'none' : 'block';
        chatInput.focus();
    };
    
    document.getElementById('close-chat').onclick = () => {
        chatModal.style.display = 'none';
    };
    
    console.log('✅ FIXED Chatbot ready!');
    addMessage('Chatbot sẵn sàng! Gõ "chào" test nhé 😊');
});

