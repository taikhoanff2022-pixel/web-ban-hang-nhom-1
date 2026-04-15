// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCart();
    setupEventListeners();
});

// Load products to grid
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification('Đã thêm vào giỏ hàng!');
}

// Update cart display
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = formatPrice(total);
    document.getElementById('checkout-total').textContent = formatPrice(total);
}

// Show cart
document.getElementById('cart-link').addEventListener('click', function(e) {
    e.preventDefault();
    showCart();
});

function showCart() {
    const cartSection = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Giỏ hàng trống</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div style="flex: 1;">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} x <span id="qty-${item.id}">${item.quantity}</span></p>
                </div>
                <div>
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: #f39c12; color: white; border: none; padding: 5px 10px; margin-right: 5px; border-radius: 3px;">-</button>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: #27ae60; color: white; border: none; padding: 5px 10px; border-radius: 3px;">+</button>
                    <br><br>
                    <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px;">Xóa</button>
                </div>
            </div>
        `).join('');
    }
    
    cartSection.classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cart').classList.add('hidden');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            showCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showCart();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

// Checkout form
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate payment processing
    setTimeout(() => {
        alert('Cảm ơn bạn! Đơn hàng đã được xác nhận. Chúng tôi sẽ liên hệ sớm.');
        cart = [];
        updateCart();
        closeCheckout();
        closeCart();
    }, 1500);
});

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: #27ae60; 
        color: white; padding: 15px 20px; border-radius: 8px; 
        z-index: 5000; transform: translateX(400px); transition: all 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Mobile menu
function setupEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
