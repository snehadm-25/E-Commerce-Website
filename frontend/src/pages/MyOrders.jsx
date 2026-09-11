import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Calendar, Clock, ArrowRight } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.data);
            } catch (err) {
                setError('Failed to fetch your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 font-semibold mt-10">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center bg-slate-50 rounded-3xl p-16 border border-slate-100">
                    <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No orders found</h3>
                    <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/products" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden transition hover:shadow-md">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Placed</p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                                        <p className="text-sm font-semibold text-slate-900">{formatPrice(order.totalAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Method</p>
                                        <p className="text-sm font-semibold text-slate-900">{order.paymentMethod === 'Cash On Delivery' ? 'Cash (COD)' : 'Credit Card'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    {order.status === 'completed' && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to request a return for this order?")) {
                                                    try {
                                                        await api.put(`/orders/${order._id}/return`);
                                                        // Update local state to immediately show 'return requested'
                                                        setOrders(orders.map(o => o._id === order._id ? { ...o, status: 'return requested' } : o));
                                                    } catch (err) {
                                                        alert(err.response?.data?.message || 'Failed to request return');
                                                    }
                                                }
                                            }}
                                            className="text-sm font-bold text-pink-600 hover:text-pink-800"
                                        >
                                            Request Return
                                        </button>
                                    )}
                                    <Link to={`/order/${order._id}`} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800">
                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-4">
                                    {order.items.slice(0, 4).map((item) => (
                                        <div key={item._id || item.product} className="relative group">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                                            {item.quantity > 1 && (
                                                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    x{item.quantity}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                            +{order.items.length - 4} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
