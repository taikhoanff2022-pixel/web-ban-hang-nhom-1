// Product data - Full catalog with various products
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 29990000,
        image: "https://images.unsplash.com/photo-1691116382795-66219878c6b1?w=400&h=400&fit=crop",
        description: "iPhone 15 Pro Max 256GB Titan Xám - Hàng chính hãng",
        category: "Điện thoại"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 25990000,
        image: "https://images.unsplash.com/photo-1701745443442-94b3344fc5a0?w=400&h=400&fit=crop",
        description: "Galaxy S24 Ultra 512GB Titan Đen - Flagship 2024",
        category: "Điện thoại"
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        price: 49990000,
        image: "https://images.unsplash.com/photo-1589529845076-8e7d4e0b421e?w=400&h=400&fit=crop",
        description: "MacBook Pro 14' M3 Pro 18GB RAM 512GB SSD",
        category: "Laptop"
    },
    {
        id: 4,
        name: "iPad Pro M4",
        price: 23990000,
        image: "https://images.unsplash.com/photo-1728026694025-7fd574d30a95?w=400&h=400&fit=crop",
        description: "iPad Pro 11' M4 256GB WiFi + Cellular",
        category: "Máy tính bảng"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        price: 8990000,
        image: "https://images.unsplash.com/photo-1578632350634-9b99dc9d3e7d?w=400&h=400&fit=crop",
        description: "Tai nghe không dây Sony WH-1000XM5 - Khử tiếng ồn chủ động",
        category: "Phụ kiện"
    },
    {
        id: 6,
        name: "Apple Watch Ultra 2",
        price: 19990000,
        image: "https://images.unsplash.com/photo-1682695797684-0e610896b9d1?w=400&h=400&fit=crop",
        description: "Apple Watch Ultra 2 49mm GPS + Cellular",
        category: "Đồng hồ"
    },
    {
        id: 7,
        name: "AirPods Pro 2",
        price: 5990000,
        image: "https://images.unsplash.com/photo-1588423771075-1b3034ec1f16?w=400&h=400&fit=crop",
        description: "AirPods Pro 2 USB-C - MagSafe Charging Case",
        category: "Phụ kiện"
    },
    {
        id: 8,
        name: "Dell XPS 13",
        price: 35990000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        description: "Dell XPS 13 9340 Intel Core Ultra 7 16GB RAM 512GB SSD",
        category: "Laptop"
    },
    {
        id: 9,
        name: "GoPro HERO12 Black",
        price: 12990000,
        image: "https://images.unsplash.com/photo-1602718951142-5631b109fb45?w=400&h=400&fit=crop",
        description: "GoPro HERO12 Black 5.3K60 - Action Camera",
        category: "Máy quay"
    },
    {
        id: 10,
        name: "Kindle Paperwhite",
        price: 3490000,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
        description: "Kindle Paperwhite Signature Edition 32GB - Đèn nền ấm",
        category: "Đọc sách"
    }
];

// Format price to Vietnamese Dong
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Export for other scripts
window.products = products;
window.formatPrice = formatPrice;
