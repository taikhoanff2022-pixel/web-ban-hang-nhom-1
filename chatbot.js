// ULTIMATE Chatbot - Multi Question Support + Pro Responses
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PRO Chatbot v2.0 initializing...');
    
    // Robust DOM selection
    const elements = {
        chatMessages: document.getElementById('chat-messages'),
        chatInput: document.getElementById('chat-input'),
        chatSendBtn: document.getElementById('chat-send'),
        chatModal: document.getElementById('chat-modal'),
        chatToggle: document.getElementById('chat-toggle'),
        closeChat: document.getElementById('close-chat'),
        chatStatusText: document.getElementById('chat-status-text')
    };
    
    Object.entries(elements).forEach(([key, el]) => {
        if (!el) console.error(`❌ Missing ${key}`);
    });
    
    if (!elements.chatMessages) return console.error('Chatbot cannot start - missing core elements');
    
    let isTyping = false;
    let isLiveChat = false;
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    // Products sync
    const products = [];
    const syncProducts = () => {
        if (window.products && Array.isArray(window.products)) {
            Object.assign(products, window.products);
            console.log(`✅ Synced ${products.length} products`);
        }
    };
    
    // Auto sync every 500ms max 10s
    let syncAttempts = 0;
    const productSyncInterval = setInterval(() => {
        syncProducts();
        if (products.length > 0 || syncAttempts > 20) clearInterval(productSyncInterval);
        syncAttempts++;
    }, 500);

    // PRO Response database
    const responses = {
        greetings: [
            'Xin chào bạn! 👋 ShopVN Pro sẵn sàng hỗ trợ 24/7!',
            'Chào bạn! 😊 Hỏi mình về iPhone, laptop, tai nghe hay bất cứ gì nhé!',
            'Hello! Shop có 16+ sản phẩm HOT. Bạn cần tư vấn gì ạ?',
            '👋 Rất vui được hỗ trợ bạn! Gõ tên sản phẩm để biết giá ngay!'
        ],
        products: [
            `Có **${products.length || 16}** sản phẩm HOT: iPhone, Samsung, MacBook, PS5...`,
            'Sản phẩm nổi bật: iPhone 15 Pro Max, Galaxy S24 Ultra, MacBook M3 Pro 🔥',
            'Xem ngay danh sách sản phẩm hoặc hỏi cụ thể tên sp nhé!'
        ],
        price: [
            '💰 Giá cực tốt + freeship COD:<br>• iPhone 15 Pro Max: 25.9tr<br>• MacBook M3: 48.9tr<br>• PS5 Slim: 14.9tr',
            'Tất cả giá đã VAT. Hỏi tên sản phẩm cụ thể để báo giá chi tiết!',
            'Giá cạnh tranh nhất thị trường + bảo hành chính hãng 100%! 💎'
        ],
        cart: [
            '🛒 Cách mua hàng:<br>1. Click nút "+" thêm giỏ<br>2. "Giỏ hàng" góc phải<br>3. Checkout COD freeship!',
            'Giỏ hàng tự lưu, mua tiếp được. Hỗ trợ đổi trả 30 ngày!',
            'Thanh toán linh hoạt: COD, chuyển khoản, thẻ, trả góp 0%'
        ],
        delivery: [
            '🚚 Giao hàng TOÀN QUỐC:<br>• Nội thành: 2h-4h<br>• Ngoại tỉnh: 1-3 ngày<br>• Freeship đơn >1tr!',
            'Ship COD 0đ, kiểm tra hàng trước khi thanh toán an toàn 100%',
            'Hotline track đơn: 1800-123-456'
        ],
        warranty: [
            '🛡️ BẢO HÀNH CHÍNH HÃNG:<br>Điện thoại/laptop: 12-24 tháng<br>Tai nghe/watch: 12 tháng<br>PS5: 24 tháng',
            'Hỗ trợ sửa chữa nhanh tại 63 tỉnh thành!',
            '1 đổi 1 trong 30 ngày nếu lỗi nhà sản xuất'
        ],
        payment: [
            '💳 THANH TOÁN LINH HOẠT:<br>• COD kiểm tra hàng<br>• Chuyển khoản Momo/VNPay<br>• Trả góp 0% thẻ<br>• QR code instant',
            'An toàn 100% - ShopVN Pro cam kết!',
            'Ưu đãi 5% chuyển khoản ngay!'
        ],
        agent: [
            'Minh đây ạ! 👨‍💼 Chuyên viên ShopVN Pro. Hỗ trợ bạn ngay!',
            'Sản phẩm nào cần tư vấn chi tiết? Check tồn + báo giá ngay!',
            'Có ưu đãi đặc biệt hôm nay! Mua 2 sp giảm thêm 5%',
            'Ship siêu tốc - xử lý đơn trong 2h!',
            'Cảm ơn bạn đã tin tưởng ShopVN! 😊'
        ],
        default: [
            'Tôi hiểu bạn muốn hỏi gì đó hay ho! 😄 Gợi ý:<br>• "giá iPhone/PS5"<br>• "giao hàng bao lâu"<br>• "<strong>chat trực tiếp</strong>" gặp nhân viên',
            'Shop có **16+ sp** sẵn hàng. Hỏi tên sản phẩm hoặc vấn đề cụ thể nhé!',
            '👆 Thử "giá MacBook" hoặc "chat trực tiếp" xem sao!'
        ]
    };

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(price || 0);
    }
    
    function getRandomResponse(key) {
        const arr = responses[key] || responses.default;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getProductInfo(query) {
        const lowerQuery = query.toLowerCase();
        const product = products.find(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
        if (product) {
            return `<strong>${product.name}</strong><br>💰 <strong>${formatPrice(product.price)}</strong><br>${product.description}`;
        }
        return null;
    }
    
    function matchIntent(message) {
        const lowerMsg = message.toLowerCase();
        
        // Live chat
        if (['trực tiếp', 'live', 'nhân viên', 'tư vấn', 'chat trực tiếp', 'gặp nhân viên'].some(w => lowerMsg.includes(w))) {
            return 'livechat';
        }
        
        // Business questions
        if (['giao hàng', 'ship', 'giao', 'vận chuyển', 'freeship'].some(w => lowerMsg.includes(w))) return 'delivery';
        if (['bảo hành', 'bh', 'sửa chữa', 'đổi trả'].some(w => lowerMsg.includes(w))) return 'warranty';
        if (['thanh toán', 'tt', 'chuyển khoản', 'cod', 'trả góp'].some(w => lowerMsg.includes(w))) return 'payment';
        
        // Standard
        if (['xin chào', 'hello', 'chào', 'hi', 'alo', 'xin chào shop'].some(g => lowerMsg.includes(g))) return 'greetings';
        if (['sản phẩm', 'sp', 'hàng', 'catalogue'].some(p => lowerMsg.includes(p))) return 'products';
        if (['giá', 'price', 'bao nhiêu', 'mấy tiền', 'giá bao nhiêu'].some(pr => lowerMsg.includes(pr))) return 'price';
        if (['giỏ', 'cart', 'đặt hàng', 'mua'].some(c => lowerMsg.includes(c))) return 'cart';
        
        // Product lookup
        const productMatch = getProductInfo(message);
        if (productMatch) return { type: 'product', info: productMatch };
        
        return 'default';
    }
    
    async function getResponse(userMessage) {
        console.log('🤖 AI processing:', userMessage);
        const intent = matchIntent(userMessage);
        
        if (intent === 'livechat') {
            isLiveChat = true;
            addMessage('🔄 <strong>Đang kết nối nhân viên VIP...</strong>');
            
            setTimeout(() => {
                addMessage('✅ <strong>Minh - Chuyên viên ShopVN Pro</strong><br>Chào bạn! 👨‍💼 Hỗ trợ ngay nhé!', false, true);
            }, 800);
            return;
        }
        
        if (isLiveChat) {
            // Agent mode - more professional
            const agentReplies = [
                'Có hàng sẵn ạ! Ship COD freeship nội thành trong 4h 🚚',
                'Giá đã tốt nhất + quà tặng kèm chuột bàn phím!',
                'Ưu đãi đặc biệt: Mua 2 giảm 500k + freeship ngoại tỉnh!',
                'Bảo hành chính hãng 24 tháng, đổi mới 1:1 trong 7 ngày!',
                'Xử lý đơn siêu tốc - nhận hàng trong ngày tại HN/SG!'
            ];
            setTimeout(() => addMessage(getRandomResponse('agent'), false, true), 1200);
            return;
        }
        
        let response = getRandomResponse('default');
        
        // Intent specific
        if (intent === 'greetings') response = getRandomResponse('greetings');
        else if (intent === 'products') response = getRandomResponse('products');
        else if (intent === 'price') response = getRandomResponse('price'); 
        else if (intent === 'cart') response = getRandomResponse('cart');
        else if (intent === 'delivery') response = getRandomResponse('delivery');
        else if (intent === 'warranty') response = getRandomResponse('warranty');
        else if (intent === 'payment') response = getRandomResponse('payment');
        else if (intent.type === 'product') response = intent.info;
        
        // Typing simulation
        addMessage('⏳ Đang xử lý...');
        await new Promise(r => setTimeout(r, Math.random() * 800 + 600));
        chatMessages.lastElementChild.remove(); // Remove typing
        
        addMessage(response);
    }
    
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || isTyping) return;
        
        addMessage(text, true);
        chatInput.value = '';
        chatInput.focus();
        getResponse(text);
    }
    
    // Bulletproof events
    ['click', 'keypress'].forEach(eventType => {
        chatToggle?.addEventListener(eventType, e => {
            if (eventType === 'keypress' && e.key !== 'Enter') return;
            e.stopPropagation();
            chatModal.style.display = 'block';
            chatInput.focus();
            
            if (chatHistory.length === 0) {
                setTimeout(() => {
                    addMessage('🎉 <strong>ShopVN Pro Chatbot</strong><br><br>👋 Chào bạn!<br>Hỏi mình:<br>• "giá iPhone/PS5"<br>• "giao hàng" <br>• "<strong>chat trực tiếp</strong>" gặp nhân viên VIP<br><br>Sẵn sàng hỗ trợ 24/7! 🔥');
                }, 100);
            }
        });
    });
    
    closeChat?.addEventListener('click', e => {
        e.stopPropagation();
        chatModal.style.display = 'none';
        isLiveChat = false;
    });
    
    chatSendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    chatModal?.addEventListener('click', e => {
        if (e.target === chatModal) chatModal.style.display = 'none';
    });
    
    // Status indicator
    function updateStatus(status = 'Online', color = '#00d4aa') {
        const dot = document.querySelector('.chat-status');
        const text = chatStatusText;
        if (dot) dot.style.background = color;
        if (text) text.textContent = status;
    }
    updateStatus();
    
    console.log('✅ PRO Chatbot v2.0 LIVE!');
    
    // Debug panel
    window.chatbotDebug = { sendMessage, products, chatHistory, addMessage };
});

