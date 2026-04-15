// Checkout page functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutData();
    setupForm();
});

function loadCheckoutData() {
    const itemsList = document.getElementById('checkout-items-list');
    const finalTotalEl = document.getElementById('final-total');
    
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    itemsList.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-info">
                <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                <div>
                    <h4>${item.name}</h4>
                    <p>Số lượng: ${item.quantity}</p>
                </div>
            </div>
            <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    finalTotalEl.textContent = formatPrice(total);
}

function setupForm() {
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', handleOrderSubmit);
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const formData = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        payment: document.querySelector('input[name="payment"]:checked').value
    };
    
    if (!form.checkValidity()) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Show processing
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    submitBtn.disabled = true;
    
    // Simulate API call and order processing
    setTimeout(() => {
        const orderId = 'DH' + Date.now().toString().slice(-6);
        const orderSummary = {
            id: orderId,
            items: cart.map(item => ({name: item.name, qty: item.quantity, price: item.price})),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            customer: formData,
            timestamp: new Date().toLocaleString('vi-VN')
        };
        
        // Save order history
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.unshift(orderSummary);
        localStorage.setItem('orders', JSON.stringify(orders.slice(0, 10))); // Keep last 10 orders
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success
        showOrderSuccess(orderId, formData);
        
    }, 2000);
}

function showOrderSuccess(orderId, customerData) {
    const successDiv = document.createElement('div');
    successDiv.className = 'order-success';
    successDiv.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); z-index: 10000; 
        display: flex; align-items: center; justify-content: center;
    `;
    successDiv.innerHTML = `
        <div style="
            background: white; padding: 40px; border-radius: 20px; 
            text-align: center; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <div style="font-size: 60px; color: #27ae60; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Đặt hàng thành công! 🎉</h2>
            <p>Mã đơn hàng: <strong style="color: #e74c3c;">${orderId}</strong></p>
            <p>Giao hàng tới: <strong>${customerData.name}</strong></p>
            <p>SĐT: <strong>${customerData.phone}</strong></p>
            <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <p><strong>⏱ Thời gian xử lý:</strong> 1-3 ngày</p>
                <p><strong>📦 Giao hàng:</strong> Toàn quốc</p>
                <p><strong>💰 Thanh toán:</strong> ${customerData.payment === 'cod' ? 'COD' : customerData.payment.toUpperCase()}</p>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="printOrder('${orderId}')" 
                        style="padding: 12px 30px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-print"></i> In đơn hàng
                </button>
                <button onclick="continueShopping()" 
                        style="padding: 12px 30px; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-shopping-bag"></i> Mua tiếp
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Re-enable form
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> ĐẶT HÀNG';
    submitBtn.disabled = false;
}

function printOrder(orderId) {
    window.print();
}

function continueShopping() {
    window.location.href = 'index.html';
}

// Make formatPrice available if products.js not loaded
if (typeof formatPrice === 'undefined') {
    window.formatPrice = function(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
}
