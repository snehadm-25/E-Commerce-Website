import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const res = await api.get('/cart');
            setCartItems(res.data.data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) return { success: false, message: 'Please login to add to cart' };
        try {
            const res = await api.post('/cart', { productId, quantity });
            setCartItems(res.data.data.items);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add item' };
        }
    };

    const updateItemQuantity = async (productId, quantity) => {
        try {
            const res = await api.put(`/cart/${productId}`, { quantity });
            setCartItems(res.data.data.items);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    const removeCartItem = async (productId) => {
        try {
            const res = await api.delete(`/cart/${productId}`);
            setCartItems(res.data.data.items);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Remove failed' };
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart');
            setCartItems([]);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Clear failed' };
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, loading, cartTotal, cartItemCount,
            addToCart, updateItemQuantity, removeCartItem, clearCart, refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
