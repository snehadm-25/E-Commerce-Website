import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, loading, cartTotal, updateItemQuantity, removeCartItem, clearCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
                <ShoppingBag className="mx-auto h-16 w-16 text-slate-200 mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 font-medium">Looks like you haven't added anything yet.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-16 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h1>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <ul className="divide-y divide-slate-100">
                        {cartItems.map((item) => (
                            <li key={item.product._id} className="py-6 flex flex-col sm:flex-row sm:items-center">
                                <div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>

                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600">
                                            <Link to={`/products/${item.product._id}`}>{item.product.name}</Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500 font-medium">{formatPrice(item.product.price)}</p>
                                    </div>

                                    <div className="mt-4 sm:mt-0 flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`quantity-${item.product._id}`} className="sr-only">Quantity</label>
                                            <select
                                                id={`quantity-${item.product._id}`}
                                                value={item.quantity}
                                                onChange={(e) => updateItemQuantity(item.product._id, Number(e.target.value))}
                                                className="block w-20 pl-3 pr-8 py-2 text-base border border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg font-medium"
                                            >
                                                {[...Array(item.product.stock > 10 ? 10 : item.product.stock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeCartItem(item.product._id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-50 px-6 sm:px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex space-x-4 mb-4 sm:mb-0">
                        <button
                            onClick={clearCart}
                            className="text-sm font-semibold text-slate-500 hover:text-red-600 transition"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center text-xl font-bold text-slate-900 mb-4">
                            <span className="mr-4 text-slate-500 font-medium">Subtotal</span>
                            {formatPrice(cartTotal)}
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Shipping and taxes calculated at checkout.</p>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full sm:w-auto flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-slate-900 hover:bg-slate-800 transition"
                        >
                            Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
