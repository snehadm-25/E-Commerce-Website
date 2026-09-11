import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Truck, ShieldCheck, Loader, CreditCard } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';

const Checkout = () => {
    const { cartItems, cartTotal, refreshCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const validateShipping = () => {
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
        for (let field of requiredFields) {
            if (!shippingAddress[field] || !shippingAddress[field].trim()) {
                setError(`Please fill out the shipping address: ${field} is required.`);
                return false;
            }
        }
        setError(null);
        return true;
    };

    const placeOrder = async (paymentIntentId = null) => {
        if (!validateShipping()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await api.post('/orders', {
                shippingAddress,
                paymentMethod: paymentMethod,
                paymentResult: paymentIntentId ? { id: paymentIntentId, status: 'succeeded' } : null
            });
            await refreshCart(); // clear logic
            navigate('/order-success', {
                state: {
                    orderId: res.data.data._id,
                    total: cartTotal,
                    paymentMethod: paymentMethod
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setIsSubmitting(false); // Can let them retry
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="pb-16 max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Secure AES-256 encrypted checkout powered by Stripe</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-md">
                    <p className="text-sm text-red-700 font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <Truck className="w-6 h-6 mr-3 text-blue-600" /> Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <input required type="text" name="fullName" value={shippingAddress.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                <input required type="email" name="email" value={shippingAddress.email} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                                <input required type="tel" name="phone" value={shippingAddress.phone} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                                <input required type="text" name="address" value={shippingAddress.address} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-1 border-r border-transparent">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                                <input required type="text" name="city" value={shippingAddress.city} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">State</label>
                                <input required type="text" name="state" value={shippingAddress.state} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Postal Code</label>
                                <input required type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center pt-8 border-t border-slate-100">
                            <CreditCard className="w-6 h-6 mr-3 text-blue-600" /> Payment Details
                        </h2>

                        <div className="flex space-x-6 mb-8">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="Credit Card"
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span className="ml-3 text-slate-700 font-semibold">Credit Card</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="Cash On Delivery"
                                    checked={paymentMethod === 'Cash On Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span className="ml-3 text-slate-700 font-semibold">Cash On Delivery</span>
                            </label>
                        </div>

                        {paymentMethod === 'Credit Card' ? (
                            <PaymentForm handlePaymentSuccess={placeOrder} amount={cartTotal} validateData={validateShipping} />
                        ) : (
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                                <p className="text-slate-700 font-medium mb-4">You will pay in cash to the courier when your order arrives.</p>
                                <button
                                    onClick={(e) => { e.preventDefault(); placeOrder(null); }}
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <><Loader className="w-5 h-5 animate-spin" /> <span>Processing Order...</span></>
                                    ) : (
                                        <><Truck className="w-5 h-5" /> <span>Confirm Order & Pay Later</span></>
                                    )}
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="max-h-72 overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="flex items-center space-x-4">
                                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl bg-slate-800" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{item.product.name}</p>
                                        <p className="text-slate-400 text-sm font-medium">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-700 pt-6 space-y-4 mb-4">
                            <div className="flex justify-between text-sm font-medium text-slate-300">
                                <p>Subtotal</p>
                                <p>{formatPrice(cartTotal)}</p>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-slate-300">
                                <p>Shipping</p>
                                <p>Free</p>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-4">
                                <p>Total</p>
                                <p>{formatPrice(cartTotal)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-6 text-slate-400">
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">100% Encrypted Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
