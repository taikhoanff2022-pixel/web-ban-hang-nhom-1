// COMPLETE E-COMMERCE + FUNCTIONAL CHATBOT
// Web bán hàng: Products + Cart + Usable Chatbot (Vietnamese support)
// Loads data/products.json, integrates cart/chat, localStorage

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.products = [];
window.addToCart = addToCart;
window.formatPrice = formatPrice;

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        window.products = products;
        renderProducts();
        console.log('✅ Loaded', products.length, 'products');
    } catch (error) {
        console.error('Products load failed:', error);
        // Fallback inline data
        products = [{"id":1,"name":"iPhone 15 Pro Max","price":25900000,"image":"https://via.placeholder.com/400x300/667eea/ffffff?text=iPhone"}];
        renderProducts();
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.description || 'Sản phẩm chất lượng cao'}</p>
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="add-to-cart" data-id="${p.id}">
                    <i class="fas fa-cart-plus"></i> Thêm Giỏ
                </button>
            </div>
        </div>
    `).join('');
    
    // Event delegation
    grid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const id = parseInt(e.target.closest('.add-to-cart').dataset.id);
            addToCart(id);
        }
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);
}

function addToCart(id) {
    const product = products.find(p => p.id === id) || window.products.find(p => p.id === id);
    if (!product) return;
    
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showNotification(`✅ Thêm "${product.name}"`);
}

function renderCart() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const itemsEl = document.getElementById('cart-items');
    
    if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (totalEl) totalEl.textContent = formatPrice(cart.reduce((sum, i) => sum + i.price * i.quantity, 0));
    
    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<div style="text-align:center;padding:2rem;color:#666;"><i class="fas fa-shopping-cart" style="font-size:3rem;opacity:0.5;"></i><p>Giỏ hàng trống</p><button onclick="loadProducts()" style="margin-top:1rem;">Tải sản phẩm</button></div>';
        } else {
            itemsEl.innerHTML = cart.map(item => {
                const product = products.find(p => p.id === item.id) || item;
                return `
                    <div class="cart-item">
                        <div style="display:flex;gap:1rem;align-items:center;">
                            <img src="${product.image}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/60?text=🛒'">
                            <div>
                                <div style="font-weight:600;">${product.name}</div>
                                <small>${item.quantity}x</small>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700;">${formatPrice(item.price * item.quantity)}</div>
                            <button onclick="removeFromCart(${item.id})" style="background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:5px;cursor:pointer;">
                                Xóa
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showNotification('🗑️ Đã xóa');
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    showNotification('🧹 Xóa giỏ');
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position:fixed;top:100px;right:20px;background:#10b981;color:white;
        padding:1rem 2rem;border-radius:8px;z-index:9999;font-weight:500;
        animation:slideIn 0.3s;
    `;
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// CHATBOT - FULLY FUNCTIONAL
function initChatbot() {
    const messagesEl = document.getElementById('chat-messages');
    const inputEl = document.getElementById('chat-input');
    const sendEl = document.getElementById('chat-send');
    const toggleEl = document.getElementById('chat-toggle');
    const modalEl = document.getElementById('chat-modal');
    
    if (!messagesEl || !inputEl) return;
    
    function addMessage(text, isUser = false) {
        const div = document.createElement('div');
        div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        div.innerHTML = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    function getBotReply(input) {
        const lower = input.toLowerCase();
        const prods = window.products;
        
        // Product search
        if (lower.includes('iphone') || lower.includes('điện thoại')) {
            const p = prods.find(p => p.name.toLowerCase().includes('iphone'));
            return p ? `📱 <strong>${p.name}</strong><br>${formatPrice(p.price)}<br>${p.description.slice(0,80)}...` : 'iPhone 15 Pro Max: 25.9tr 🔥';
        }
        
        if (lower.includes('macbook') || lower.includes('laptop')) {
            const p = prods.find(p => p.name.toLowerCase().includes('macbook'));
            return p ? `💻 <strong>${p.name}</strong><br>${formatPrice(p.price)}` : 'MacBook M3 Pro: 48.9tr ⭐';
        }
        
        if (lower.includes('tai nghe') || lower.includes('airpods')) {
            const p = prods.find(p => p.name.toLowerCase().includes('airpods') || p.name.includes('sony'));
            return p ? `🎧 <strong>${p.name}</strong><br>${formatPrice(p.price)}` : 'AirPods Pro 2: 6.89tr 🎵';
        }
        
        if (lower.includes('giá') || lower.includes('price')) {
            return `💰 GIÁ HOT:<br>• iPhone 15 Pro Max: 25.9tr<br>• MacBook M3: 48.9tr<br>• AirPods: 6.89tr<br>Hỏi tên sp cụ thể!`;
        }
        
        if (lower.includes('giỏ') || lower.includes('cart')) {
            const total = cart.reduce((s,i)=>s+i.price*i.quantity,0);
            return cart.length ? `🛒 Giỏ: ${cart.length} sp<br>Tổng: ${formatPrice(total)}<br>Click "Giỏ Hàng" checkout!` : '🛒 Giỏ trống! Thêm sp nhé!';
        }
        
        if (lower.includes('giao') || lower.includes('ship')) {
            return '🚚 <strong>COD TOÀN QUỐC</strong><br>✅ Freeship nội thành<br>✅ 2-5 ngày tỉnh<br>✅ Đổi trả 7 ngày';
        }
        
        if (lower.includes('chào') || lower.includes('hi')) {
            return '👋 Chào bạn! ShopVN hỗ trợ 24/7.<br>Hỏi: "giá iPhone", "giỏ hàng", "giao hàng"?';
        }
        
        return `🤖 Hỏi thử nhé:<br>• "giá iPhone"<br>• "giỏ hàng"<br>• "giao hàng"<br>• "macbook"`;
    }
    
    sendEl?.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) return;
        addMessage(text, true);
        inputEl.value = '';
        
        setTimeout(() => {
            addMessage(getBotReply(text));
        }, 400);
    });
    
    inputEl?.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendEl.click();
    });
    
    toggleEl?.addEventListener('click', () => {
        modalEl.style.display = modalEl.style.display === 'block' ? 'none' : 'block';
        if (modalEl.style.display === 'block') {
            inputEl.focus();
            if (messagesEl.children.length === 0) addMessage('Xin chào! Hỏi mình về sản phẩm nhé 😊');
        }
    });
    
    // Close chat
    document.getElementById('close-chat')?.addEventListener('click', () => {
        modalEl.style.display = 'none';
    });
    
    console.log('✅ Chatbot activated');
}

// Modals init
function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
    
    document.getElementById('cart-link')?.addEventListener('click', e => {
        e.preventDefault();
        renderCart();
        document.getElementById('cart-modal').style.display = 'block';
    });
    
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('checkout-modal').style.display = 'block';
    });
    
    document.getElementById('checkout-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showNotification('🎉 Đặt hàng COD thành công!');
        clearCart();
        document.getElementById('checkout-modal').style.display = 'none';
        e.target.reset();
    });
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderCart();
    initChatbot();
    initModals();
    
    // Dark mode (inline already in HTML)
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    console.log('🚀 Web bán hàng + Chatbot COMPLETE!');
});
