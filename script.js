// Load products from JSON
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartModal = document.getElementById('cartModal');
const chatModal = document.getElementById('chatbotContainer');
const cartToggle = document.getElementById('cartToggle');
const chatToggle = document.getElementById('chatToggle');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadProducts();
  renderProducts();
  updateCartUI();
  
  // Event listeners
  cartToggle.addEventListener('click', toggleCart);
  document.querySelector('.close-cart').addEventListener('click', toggleCart);
  chatToggle.addEventListener('click', toggleChat);
  document.querySelector('.close-chat').addEventListener('click', toggleChat);
  checkoutBtn.addEventListener('click', handleCheckout);
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) toggleCart();
    if (e.target === chatModal) toggleChat();
  });
}

async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    products = await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function renderProducts() {
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  
  // Visual feedback
  const btn = event.target;
  btn.textContent = 'Đã thêm!';
  btn.style.background = '#28a745';
  setTimeout(() => {
    btn.textContent = 'Thêm vào giỏ';
    btn.style.background = '';
  }, 1500);
}

function updateCartUI() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Giỏ hàng trống</p>';
    cartTotal.textContent = '0 VNĐ';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} x${item.quantity}</span>
      <div>
        <span>${formatPrice(item.price * item.quantity)}</span>
        <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:red;font-size:1.2rem;margin-left:1rem;">×</button>
      </div>
    </div>
  `).join('');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `${formatPrice(total)}`;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function toggleCart() {
  cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
  if (cartModal.style.display === 'block') updateCartUI();
}

function handleCheckout() {
  if (cart.length === 0) return alert('Giỏ hàng trống!');
  
  const name = prompt('Tên của bạn:');
  const phone = prompt('SĐT:');
  const address = prompt('Địa chỉ:');
  
  if (name && phone && address) {
    alert(`Cảm ơn ${name}! Đơn hàng đã được gửi. Tổng: ${cartTotal.textContent}. Chúng tôi sẽ liên hệ qua ${phone}.`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    toggleCart();
    updateCartUI();
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
}

// Chatbot
let isTyping = false;

function toggleChat() {
  chatModal.style.display = chatModal.style.display === 'flex' ? 'none' : 'flex';
  if (chatModal.style.display === 'flex') {
    addBotMessage('Xin chào! 👋 Tôi là chatbot hỗ trợ bán hàng. Bạn cần hỏi về sản phẩm nào? (VD: "giá iPhone", "danh sách laptop")');
  }
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message || isTyping) return;
  
  addUserMessage(message);
  chatInput.value = '';
  
  setTyping(true);
  setTimeout(() => {
    const response = getBotResponse(message.toLowerCase());
    addBotMessage(response);
    setTyping(false);
  }, 1000 + Math.random() * 2000);
}

function addUserMessage(text) {
  chatMessages.innerHTML += `
    <div class="message user-message">${text}</div>
  `;
  scrollToBottom();
}

function addBotMessage(text) {
  chatMessages.innerHTML += `
    <div class="message bot-message">${text}</div>
  `;
  scrollToBottom();
}

function setTyping(typing) {
  isTyping = typing;
  const typingEl = document.querySelector('.typing');
  if (typingEl) typingEl.remove();
  
  if (typing) {
    chatMessages.innerHTML += '<div class="message bot-message typing">Bot đang gõ...</div>';
    scrollToBottom();
  }
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
  if (message.includes('giá') || message.includes('price')) {
    return '💰 Giá sản phẩm:\n• iPhone 15 Pro Max: 25.000.000 VNĐ\n• MacBook Pro M3: 45.000.000 VNĐ\n• AirPods Pro 2: 6.500.000 VNĐ\nHỏi cụ thể sản phẩm nhé!';
  }
  
  if (message.includes('iphone') || message.includes('điện thoại')) {
    return '📱 iPhone 15 Pro Max 256GB chỉ 25tr! Camera 48MP, chip A17 Pro siêu mạnh. Thêm vào giỏ ngay!';
  }
  
  if (message.includes('laptop') || message.includes('macbook')) {
    return '💻 MacBook Pro M3 14" 18GB RAM: 45tr. Hiệu năng đỉnh cao! Hoặc Dell XPS 13 32tr.';
  }
  
  if (message.includes('tai nghe') || message.includes('airpods')) {
    return '🎧 AirPods Pro 2 (6.5tr) hoặc Sony XM5 (8.5tr) - chống ồn tuyệt vời!';
  }
  
  if (message.includes('giỏ hàng') || message.includes('đặt hàng')) {
    return '🛒 Click nút giỏ hàng để xem và đặt hàng! Hỗ trợ thanh toán COD toàn quốc.';
  }
  
  if (message.includes('chào') || message.includes('hi')) {
    return '👋 Chào bạn! Shop có iPhone, Samsung, MacBook, tai nghe... Bạn quan tâm gì ạ?';
  }
  
  return '🤔 Tôi hiểu rồi! Bạn có thể hỏi: "giá iPhone", "laptop nào tốt", "đặt hàng"... Hoặc browse sản phẩm trên trang nhé! 😊';
}

