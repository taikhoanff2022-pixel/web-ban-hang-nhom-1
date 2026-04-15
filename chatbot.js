// Chatbot functionality - Rule-based intelligent responses
const chatbotResponses = {
    greetings: [
        "Xin chào! 👋 Tôi có thể giúp gì cho bạn hôm nay?",
        "Chào bạn! Bạn đang tìm sản phẩm gì ạ?",
        "Hello! Rất vui được hỗ trợ bạn! 😊"
    ],
    products: [
        "Chúng tôi có rất nhiều sản phẩm chất lượng: iPhone, MacBook, tai nghe Sony, Apple Watch... Bạn quan tâm sản phẩm nào?",
        "Hiện có iPhone 15 Pro Max, Galaxy S24 Ultra, MacBook Pro M3 và nhiều sản phẩm hot khác!",
        "Danh sách sản phẩm đầy đủ ở phần Sản phẩm trên trang. Bạn có thể click vào để xem chi tiết!"
    ],
    price: [
        "Giá sản phẩm được hiển thị rõ ràng trên từng sản phẩm. Bạn click vào sản phẩm quan tâm để xem giá nhé!",
        "Tất cả sản phẩm đều có giá cạnh tranh và bảo hành chính hãng. Bạn muốn tôi tư vấn sản phẩm cụ thể nào?"
    ],
    iphone: [
        "iPhone 15 Pro Max 256GB giá 29.990.000đ - Hàng chính hãng VN/A. Chip A17 Pro cực mạnh!",
        "iPhone mới nhất với camera 48MP và titanium siêu bền!"
    ],
    macbook: [
        "MacBook Pro M3 Pro 18GB RAM 512GB SSD giá 49.990.000đ. Performance đỉnh cao!",
        "Màn hình Liquid Retina XDR tuyệt đẹp, pin dùng cả ngày!"
    ],
    cart: [
        "Bạn có thể thêm sản phẩm vào giỏ hàng bằng nút 'Thêm vào giỏ'. Click vào biểu tượng giỏ hàng để xem!",
        "Giỏ hàng được lưu tự động, bạn có thể chỉnh sửa số lượng thoải mái!"
    ],
    payment: [
        "Chúng tôi hỗ trợ thanh toán COD, chuyển khoản ngân hàng, thẻ tín dụng và ví điện tử!",
        "Tại checkout bạn chỉ cần điền thông tin, đơn hàng sẽ được xác nhận ngay!"
    },
    delivery: [
        "Giao hàng toàn quốc 1-3 ngày. Miễn phí giao hàng nội thành!",
        "Đơn hàng sẽ được giao bởi Viettel Post hoặc GHN nhanh chóng!"
    ],
    warranty: [
        "Tất cả sản phẩm đều có bảo hành chính hãng từ nhà sản xuất!",
        "iPhone/MacBook bảo hành 12 tháng, tai nghe Sony 24 tháng!"
    ],
    default: [
        "Tôi hiểu bạn đang cần hỗ trợ. Bạn có thể hỏi về sản phẩm, giá cả, giao hàng hoặc thanh toán nhé!",
        "Để được tư vấn tốt nhất, bạn có thể nói cụ thể hơn về nhu cầu mua sắm của mình!",
        "Click vào sản phẩm để xem chi tiết hoặc thêm vào giỏ hàng để mua nhé! 🛒"
    ]
};

// Keywords to match user input
const keywordPatterns = {
    'greetings': ['xin chào', 'hello', 'chào', 'hi', 'chào bạn'],
    'products': ['sản phẩm', 'điện thoại', 'laptop', 'tai nghe', 'iphone', 'samsung', 'macbook', 'apple watch'],
    'price': ['giá', 'bao nhiêu', 'giá tiền', 'chi phí'],
    'iphone': ['iphone', '15', 'pro', 'pro max'],
    'macbook': ['macbook', 'm3', 'pro'],
    'cart': ['giỏ hàng', 'cart', 'thêm vào giỏ'],
    'payment': ['thanh toán', 'payment', 'trả tiền', 'cod'],
    'delivery': ['giao hàng', 'ship', 'giao', 'vận chuyển'],
    'warranty': ['bảo hành', 'warranty', 'bh']
};

function openChatbot() {
    document.getElementById('chatbot').classList.remove('hidden');
    addBotMessage(chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)]);
}

function closeChatbot() {
    document.getElementById('chatbot').classList.add('hidden');
    document.getElementById('chat-input').value = '';
}

function sendMessage(event) {
    if (event.key === 'Enter' || event.target.nodeName === 'BUTTON') {
        const input = document.getElementById('chat-input');
        const message = input.value.trim().toLowerCase();
        
        if (message) {
            addUserMessage(input.value);
            input.value = '';
            
            setTimeout(() => {
                const response = getBotResponse(message);
                addBotMessage(response);
            }, 800);
        }
    }
}

function addUserMessage(message) {
    const messages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message user';
    messageEl.textContent = message;
    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(message) {
    const messages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message bot';
    messageEl.innerHTML = message;
    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(userMessage) {
    // Check for specific keywords first
    for (const [category, keywords] of Object.entries(keywordPatterns)) {
        if (keywords.some(keyword => userMessage.includes(keyword))) {
            const responses = chatbotResponses[category];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // Fallback to default responses
    return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
}

// Add floating chat button
document.addEventListener('DOMContentLoaded', function() {
    const floatingBtn = document.createElement('button');
    floatingBtn.innerHTML = '<i class="fas fa-comments"></i>';
    floatingBtn.className = 'chat-floating-btn';
    floatingBtn.onclick = openChatbot;
    floatingBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
        background: #e74c3c; color: white; border: none; border-radius: 50%;
        font-size: 24px; cursor: pointer; box-shadow: 0 5px 20px rgba(231,76,60,0.4);
        z-index: 1500; transition: transform 0.3s;
    `;
    floatingBtn.onmouseover = () => floatingBtn.style.transform = 'scale(1.1)';
    floatingBtn.onmouseout = () => floatingBtn.style.transform = 'scale(1)';
    
    document.body.appendChild(floatingBtn);
});
