// CHAT SIMPLE V2 - Fix "câu hỏi không cách được"
document.addEventListener('DOMContentLoaded', () => {
    console.log('💬 CHAT V2 - Space OK');
    
    const toggleBtn = document.getElementById('chat-toggle');
    const modal = document.getElementById('chat-modal');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
    
    if (!toggleBtn || !modal || !input || !sendBtn || !messages) {
        console.error('❌ Chat elements missing');
        return;
    }
    
    console.log('✅ V2 Elements OK');
    
    toggleBtn.onclick = () => {
        modal.style.display = 'block';
        input.focus();
        input.value = '';
        if (messages.children.length === 0) {
            addMessage('Xin chào! 👋 Chat ShopVN. Nhập câu hỏi (có cách OK):');
        }
    };
    
    document.querySelector('#close-chat').onclick = () => modal.style.display = 'none';
    modal.onclick = e => e.target === modal && (modal.style.display = 'none');
    
    function addMessage(text, isUser = false) {
        const div = document.createElement('div');
        div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        div.textContent = text.trim(); // Trim spaces
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    
    sendBtn.onclick = () => sendChat();
    
    input.onkeydown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendChat();
        }
    };
    
    function sendChat() {
        let text = input.value.trim();
        if (!text || text.length < 1) return;
        
        console.log('Send:', text);
        addMessage(text, true);
        input.value = '';
        input.focus();
        
        // Smart replies
        setTimeout(() => {
            let reply = getReply(text);
            addMessage(reply);
        }, 600);
    }
    
    function getReply(text) {
        const q = text.toLowerCase().trim();
        
        if (q.includes('giá') || q.includes('price') || q.includes('bao nhiêu')) {
            return '💰 GIÁ HOT TODAY:\n• iPhone 15 Pro Max: 25.9tr\n• MacBook M3: 48.9tr\n• PS5: 14.9tr\n• AirPods: 6.8tr';
        }
        
        if (q.includes('iphone') || q.includes('15')) {
            return 'iPhone 15 Pro Max 256GB\n💰 25.900.000 VNĐ\n✅ Còn 5 máy';
        }
        
        if (q.includes('macbook') || q.includes('laptop')) {
            return 'MacBook Pro M3 Pro 14"\n💰 48.900.000 VNĐ\n✅ Còn hàng';
        }
        
        if (q.includes('ps5') || q.includes('gaming')) {
            return 'PS5 Slim Digital 1TB\n💰 14.900.000 VNĐ\n🎮 Free game FIFA';
        }
        
        if (q.includes('chào') || q.includes('hello') || q.includes('hi')) {
            return 'Chào bạn! 😊 ShopVN hỗ trợ 24/7.\nHỏi giá sp hoặc chat trực tiếp!';
        }
        
        if (q.includes('trực tiếp') || q.includes('nhân viên') || q.includes('live')) {
            return '👨‍💼 <strong>Minh - Nhân viên ShopVN</strong>\nChào bạn! Hỗ trợ trực tiếp đây ạ!\nCần tư vấn sp nào ạ?';
        }
        
        if (q.includes('giỏ') || q.includes('cart') || q.includes('mua')) {
            return '🛒 HƯỚNG DẪN MUA HÀNG:\n1. Click + thêm giỏ\n2. Giỏ hàng góc phải\n3. Checkout COD freeship!';
        }
        
        return 'Câu hỏi hay! 😄 Gợi ý:\n• "giá iPhone"\n• "MacBook có hàng không"\n• "chat trực tiếp"\nHoặc hỏi tên sp cụ thể!';
    }
    
    console.log('✅ V2 Chat ready - Space fixed');
});

