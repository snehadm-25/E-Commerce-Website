import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                setError('Order not found or you are not authorized to view it.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

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

    if (error || !order) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{error}</h3>
                <Link to="/" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-16 pt-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                {/* Header success message */}
                <div className="bg-emerald-500 px-8 py-12 text-center text-white">
                    <CheckCircle className="w-20 h-20 mx-auto text-emerald-100 mb-6" />
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Order Confirmed!</h1>
                    <p className="text-emerald-100 font-medium text-lg">Thank you for your purchase.</p>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-8 border-b border-slate-100">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Order Number</p>
                            <p className="text-xl font-bold text-slate-900 break-all">{order._id}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-left sm:text-right">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                            <p className="text-lg font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 pb-8 border-b border-slate-100">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping Destination</h3>
                            <address className="not-italic text-slate-600 font-medium leading-relaxed">
                                <span className="block font-bold text-slate-800">{order.shippingAddress.fullName}</span>
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                <span className="mt-2 block">Email: {order.shippingAddress.email}</span>
                                <span className="block">Phone: {order.shippingAddress.phone}</span>
                            </address>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between mb-3 text-slate-600 font-medium">
                                    <span>Items ({order.items.length})</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between mb-4 text-slate-600 font-medium">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-slate-200 text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-slate-400" /> Items in your order
                        </h3>
                        <ul className="space-y-4">
                            {order.items.map((item) => (
                                <li key={item.product} className="flex items-center space-x-6 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-slate-50" />
                                    <div className="flex-1">
                                        <Link to={`/products/${item.product}`} className="font-bold text-slate-900 hover:text-blue-600 transition">
                                            {item.name}
                                        </Link>
                                        <p className="text-slate-500 text-sm font-medium mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold text-slate-900 whitespace-nowrap">
                                        {formatPrice(item.price)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            to="/products"
                            className="inline-flex justify-center items-center py-4 px-8 border border-transparent text-base font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        >
                            Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
