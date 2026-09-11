import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity);

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        if (product.stock < qty) return res.status(400).json({ success: false, message: 'Not enough stock available' });

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists, update quantity
            let newQty = cart.items[itemIndex].quantity + qty;
            if (newQty > product.stock) {
                newQty = product.stock;
            }
            cart.items[itemIndex].quantity = newQty;
        } else {
            // New product
            cart.items.push({ product: productId, quantity: qty });
        }

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
        res.json({ success: true, data: updatedCart });
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const qty = Number(quantity);

        if (qty < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        if (product.stock < qty) return res.status(400).json({ success: false, message: 'Not enough stock available' });

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = qty;
            await cart.save();
            const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
            res.json({ success: true, data: updatedCart });
        } else {
            res.status(404).json({ success: false, message: 'Item not in cart' });
        }
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
        res.json({ success: true, data: updatedCart });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ success: true, message: 'Cart cleared', data: cart });
    } catch (error) {
        next(error);
    }
};
