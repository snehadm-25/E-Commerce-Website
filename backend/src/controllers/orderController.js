import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod, paymentResult } = req.body;

        // Fetch user cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        const orderItems = [];
        let computedTotal = 0;

        // Verify stock and compute total from DB to prevent frontend spoofing
        for (const item of cart.items) {
            const dbProduct = await Product.findById(item.product._id);

            if (!dbProduct || dbProduct.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.product.name} is unavailable or out of stock.`
                });
            }

            const subtotal = dbProduct.price * item.quantity;
            computedTotal += subtotal;

            orderItems.push({
                product: dbProduct._id,
                name: dbProduct.name,
                image: dbProduct.image,
                price: dbProduct.price,
                quantity: item.quantity,
                subtotal
            });

            // Reduce stock (optional, but good for demo completeness)
            dbProduct.stock -= item.quantity;
            await dbProduct.save();
        }

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'Demo Card',
            totalAmount: computedTotal,
            isPaid: !!paymentResult,
            paidAt: paymentResult ? Date.now() : null,
            paymentResult: paymentResult || null,
            status: paymentResult ? 'completed' : 'pending'
        });

        const createdOrder = await order.save();

        // Clear cart upon successful order
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, data: createdOrder });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Checking if order belongs to user or if admin requests it
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

// Add customer return route
export const requestOrderReturn = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (order) {
            if (order.status !== 'completed') {
                return res.status(400).json({ success: false, message: 'Only completed orders can be returned.' });
            }
            order.status = 'return requested';
            const updatedOrder = await order.save();
            res.json({ success: true, data: updatedOrder });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Admin endpoints
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json({ success: true, data: updatedOrder });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
};
