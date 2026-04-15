// ONE-CLICK CHAT - Guaranteed Working
document.addEventListener('DOMContentLoaded', () => {
    console.log('💬 ONE-CLICK CHAT ACTIVE');
    
    // Elements
    const toggleBtn = document.getElementById('chat-toggle');
    const modal = document.getElementById('chat-modal');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
    
    if (!toggleBtn || !modal || !input || !sendBtn || !messages) {
        console.error('Chat elements missing');
        return;
    }
    
    // Open chat
    toggleBtn.onclick = () => {
        modal.style.display = 'block';
        input.focus();
        if (messages.children.length === 0) {
            addMessage('Xin chào! 👋 Chat ShopVN đây. Hỏi giá sản phẩm hoặc "chat trực tiếp" nhé!');
        }
    };
    
    // Close chat
    document.querySelector('#close-chat').onclick = () => modal.style.display = 'none';
    modal.onclick = e => e.target === modal && (modal.style.display = 'none');
    
    // Send message
    function addMessage(text, isUser = false) {
        const div = document.createElement('div');
        div.className = isUser ? 'user-message message' : 'bot-message message';
        div.innerHTML = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    
    sendBtn.onclick = () => {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        input.value = '';
        
        // Simple AI
        setTimeout(() => {
            let reply = 'Cảm ơn câu hỏi! 😊';
            
            if (text.toLowerCase().includes('giá') || text.includes('price')) {
                reply = '💰 Giá HOT:<br>iPhone 25.9tr | MacBook 48.9tr | PS5 14.9tr';
            } else if (text.toLowerCase().includes('iphone') || text.includes('samsung')) {
                reply = 'iPhone 15 Pro Max 25.9tr - Còn hàng!';
            } else if (text.toLowerCase().includes('chat trực tiếp') || text.includes('live')) {
                reply = '<span class="agent-avatar">👨‍💼</span> <strong>Minh đây!</strong> Hỗ trợ trực tiếp ạ!';
            } else if (text.toLowerCase().includes('hello') || text.includes('chào')) {
                reply = 'Chào bạn! ShopVN sẵn sàng hỗ trợ 🔥';
            }
            
            addMessage(reply);
        }, 800);
    };
    
    input.onkeypress = e => e.key === 'Enter' && sendBtn.click();
    
    console.log('✅ ONE-CLICK CHAT READY');
});

// Global fallback
window.simpleChat = {
    test: () => document.getElementById('chat-toggle').click()
};

