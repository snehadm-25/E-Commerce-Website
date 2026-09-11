import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
    },
    {
        name: 'Customer Demo',
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer',
    },
];

const products = [
    {
        name: 'AirPods Wireless Bluetooth Headphones',
        image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&auto=format&fit=crop&q=60',
        description: 'Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience.',
        category: 'Electronics',
        price: 12999,
        stock: 10,
        rating: 4.5,
        featured: true,
    },
    {
        name: 'iPhone 13 Pro 256GB Memory',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=600&auto=format&fit=crop',
        description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity.',
        category: 'Electronics',
        price: 89900,
        stock: 7,
        rating: 4.8,
        featured: true,
    },
    {
        name: 'Sony Playstation 5 Pro',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop',
        description: 'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music.',
        category: 'Electronics',
        price: 49990,
        stock: 11,
        rating: 4.9,
        featured: true,
    },
    {
        name: 'Logitech G-Series Gaming Mouse',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60',
        description: 'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse.',
        category: 'Electronics',
        price: 3499,
        stock: 15,
        rating: 4.3,
        featured: false,
    },
    {
        name: 'Amazon Echo Dot 3rd Gen',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop',
        description: 'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space.',
        category: 'Electronics',
        price: 2999,
        stock: 0, // Out of stock demo
        rating: 4,
        featured: false,
    },
    {
        name: 'Minimalist Wooden Desk',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop',
        description: 'A beautifully crafted wooden desk ideal for a modern home office.',
        category: 'Home',
        price: 15999,
        stock: 5,
        rating: 4.7,
        featured: true,
    },
    {
        name: 'Cotton Casual T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
        description: 'Comfortable, breathable cotton t-shirt for everyday wear.',
        category: 'Clothing',
        price: 799,
        stock: 50,
        rating: 4.1,
        featured: false,
    },
    {
        name: 'Advanced Yoga Mat',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop',
        description: 'Premium non-slip yoga mat with alignment lines.',
        category: 'Fitness',
        price: 1499,
        stock: 25,
        rating: 4.6,
        featured: false,
    },
    {
        name: 'Adjustable Dumbbells Set',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
        description: 'Space-saving adjustable dumbbells for full body workout at home.',
        category: 'Fitness',
        price: 9999,
        stock: 8,
        rating: 4.8,
        featured: true,
    },
    {
        name: 'The Great Gatsby - Paperback',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        description: 'The classic novel by F. Scott Fitzgerald.',
        category: 'Books',
        price: 299,
        stock: 100,
        rating: 4.9,
        featured: false,
    },
    {
        name: 'Leather Messenger Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
        description: 'Handcrafted messenger bag made from genuine leather.',
        category: 'Accessories',
        price: 4599,
        stock: 12,
        rating: 4.5,
        featured: true,
    },
    {
        name: 'Ceramic Coffee Mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
        description: 'Beautiful handmade ceramic mug, perfect for your morning brew.',
        category: 'Home & Lifestyle',
        price: 499,
        stock: 30,
        rating: 4.4,
        featured: false,
    },
    {
        name: 'Nike Air Max 2026',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
        description: 'Premium running shoes with responsive cushioning.',
        category: 'Footwear',
        price: 12999,
        originalPrice: 15999,
        stock: 14,
        rating: 4.8,
        featured: true,
    },
    {
        name: 'Classic White Sneakers',
        image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop',
        description: 'Clean, minimalist sneakers for everyday wear.',
        category: 'Footwear',
        price: 2999,
        originalPrice: 3499,
        stock: 45,
        rating: 4.3,
        featured: false,
    },
    {
        name: 'Denim Jacket Vintage Blue',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop',
        description: 'Classic fit denim jacket with rugged wear details.',
        category: 'Clothing',
        price: 3499,
        stock: 20,
        rating: 4.5,
        featured: false,
    },
    {
        name: 'Men\'s Formal Oxford Shoes',
        image: 'https://images.unsplash.com/photo-1614252209825-980f8267ce21?q=80&w=600&auto=format&fit=crop',
        description: 'Elegant leather oxfords for formal occasions.',
        category: 'Footwear',
        price: 5999,
        originalPrice: 8999,
        stock: 8,
        rating: 4.7,
        featured: true,
    },
    {
        name: 'Aviator Sunglasses polarized',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
        description: 'Classic aviator style sunglasses with UV400 protection.',
        category: 'Accessories',
        price: 1599,
        stock: 50,
        rating: 4.6,
        featured: false,
    },
    {
        name: 'Smart Home Security Camera',
        image: 'https://images.unsplash.com/photo-1557324232-b89288db8bc1?q=80&w=600&auto=format&fit=crop',
        description: '1080p HD camera with motion detection and cloud storage.',
        category: 'Home & Lifestyle',
        price: 4999,
        originalPrice: 6999,
        stock: 12,
        rating: 4.5,
        featured: true,
    },
    {
        name: 'Designer Wrist Watch',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
        description: 'Minimalist designer watch with genuine leather strap.',
        category: 'Accessories',
        price: 8999,
        originalPrice: 12999,
        stock: 5,
        rating: 4.9,
        featured: true,
    },
    {
        name: 'Organic Cotton Bedsheet Set',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=600&auto=format&fit=crop',
        description: 'Ultra-soft, breathable 100% organic cotton sheets.',
        category: 'Home & Lifestyle',
        price: 2499,
        stock: 35,
        rating: 4.2,
        featured: false,
    },
    {
        name: 'Women\'s Running Tights',
        image: 'https://images.unsplash.com/photo-1502982899975-893c9cf39028?q=80&w=600&auto=format&fit=crop',
        description: 'High-waisted compression tights for maximum performance.',
        category: 'Clothing',
        price: 1899,
        stock: 22,
        rating: 4.4,
        featured: false,
    }
];

const importData = async () => {
    try {
        // Clear all previous data
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Insert users
        await User.insertMany(users);

        // Insert products
        await Product.insertMany(products);

        console.log('Data Imported successfully');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        console.log('Data Destroyed successfully');
        process.exit();
    } catch (error) {
        console.error(`Error with data destroy: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
