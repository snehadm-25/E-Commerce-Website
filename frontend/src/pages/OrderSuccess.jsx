import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Retrieve state passed from checkout
        if (location.state && location.state.orderId) {
            setOrderDetails(location.state);
        } else {
            // Redirect home if accessed illegitimately
            navigate('/');
        }
    }, [location, navigate]);

    if (!orderDetails) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="max-w-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <div className="bg-green-50 p-4 rounded-full mb-8">
                <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Order Confirmed!</h1>
            <p className="text-lg text-slate-600 mb-8 font-medium">
                Thank you for your purchase. We're getting your order ready to be shipped.
                A confirmation has been sent to your email.
            </p>

            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 w-full max-w-md text-left mb-10">
                <h3 className="text-slate-900 font-bold mb-6 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Order Summary
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-4">
                        <span className="text-slate-500 font-medium">Order ID</span>
                        <span className="font-mono text-slate-900 font-bold">{orderDetails.orderId.substring(18, 24).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-4">
                        <span className="text-slate-500 font-medium">Date</span>
                        <span className="text-slate-900 font-bold">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-4">
                        <span className="text-slate-500 font-medium">Payment Method</span>
                        <span className="text-slate-900 font-bold">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mt-4">
                        <span className="text-slate-700 font-bold">Total Amount</span>
                        <span className="text-xl font-extrabold text-slate-900">{formatPrice(orderDetails.total)}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                    to="/my-orders"
                    className="flex-1 flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
                >
                    View My Orders
                </Link>
                <Link
                    to="/products"
                    className="flex-1 flex justify-center items-center py-4 px-6 border border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition"
                >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop More
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
