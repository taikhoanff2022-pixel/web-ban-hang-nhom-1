// Dữ liệu sản phẩm
const products = [
    {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 25000000,
        image: 'https://images.unsplash.com/photo-1695906324772-87d665292638?w=400&amp;auto=format&amp;fit=crop',
        description: 'iPhone mới nhất với camera 48MP.'
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24',
        price: 22000000,
        image: 'https://images.unsplash.com/photo-1701847787216-86e8589233dd?w=400&amp;auto=format&amp;fit=crop',
        description: 'Flagship Android với AI mạnh mẽ.'
    },
    {
        id: 3,
        name: 'MacBook Air M3',
        price: 35000000,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&amp;auto=format&amp;fit=crop',
        description: 'Laptop siêu mỏng nhẹ hiệu năng cao.'
    },
    {
        id: 4,
        name: 'Tai nghe Sony WH-1000XM5',
        price: 8500000,
        image: 'https://images.unsplash.com/photo-1578632354571-58de91a956ec?w=400&amp;auto=format&amp;fit=crop&amp;fit=crop',
        description: 'Tai nghe chống ồn tốt nhất hiện nay.'
    },
    {
        id: 5,
        name: 'Đồng hồ Apple Watch Ultra',
        price: 18000000,
        image: 'https://images.unsplash.com/photo-1664879236664-d952eea56127?w=400&amp;auto=format&amp;fit=crop',
        description: 'Đồng hồ thông minh cao cấp.'
    },
    {
        id: 6,
        name: 'Chuột Logitech MX Master 3S',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1610945262588-bde731706aa6?w=400&amp;auto=format&amp;fit=crop',
        description: 'Chuột không dây ergonomics.'
    }
];

// Hiển thị sản phẩm
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toLocaleString('vi-VN')} VNĐ</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        </div>
    `).join('');
}

// Giỏ hàng đơn giản
let cart = [];
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    alert(`Đã thêm ${product.name} vào giỏ hàng! Tổng cộng: ${cart.length} sản phẩm.`);
}

// Chatbot logic
const chatbotResponses = {
    'xin chào': 'Chào bạn! 👋 Bạn cần hỗ trợ gì về sản phẩm hôm nay?',
    'sản phẩm': 'Chúng tôi có iPhone, Samsung, MacBook, tai nghe Sony và nhiều sản phẩm khác. Bạn muốn xem loại nào?',
    'giá': 'Giá sản phẩm dao động từ 2.5tr - 35tr VNĐ. Bạn có thể xem chi tiết từng sản phẩm bên trái!',
    'giỏ hàng': 'Bạn có thể thêm sản phẩm vào giỏ bằng nút "Thêm vào giỏ". Hiện tại giỏ của bạn có ' + cart.length + ' sản phẩm.',
    'mua hàng': 'Chọn sản phẩm > Nhấn "Thêm vào giỏ" > Liên hệ để thanh toán nhé! 💳',
    'cảm ơn': 'Không có gì! Chúc bạn mua sắm vui vẻ! 🛒✨',
    'tạm biệt': 'Tạm biệt! Hẹn gặp lại bạn! 👋',
    'default': 'Xin lỗi, mình chưa hiểu. Bạn có thể hỏi về sản phẩm, giá cả, giỏ hàng hoặc chào hỏi nhé!'
};

function getBotResponse(message) {
    const lowerMsg = message.toLowerCase();
    for (const [key, response] of Object.entries(chatbotResponses)) {
        if (lowerMsg.includes(key)) {
            return response;
        }
    }
    return chatbotResponses['default'];
}

function addMessage(message, isUser) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, true);
    input.value = '';

    // Simulate typing delay
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, false);
    }, 1000);
}

// Event listeners
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Khởi tạo
displayProducts();
addMessage('Xin chào! Mình là chatbot hỗ trợ mua sắm. Bạn cần giúp gì ạ? 😊', false);
