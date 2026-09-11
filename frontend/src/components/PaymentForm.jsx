import React, { useState } from 'react';
import { CreditCard, Loader, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ handlePaymentSuccess, amount, validateData }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateData && !validateData()) {
            return;
        }

        setIsProcessing(true);

        // Simulate 2 seconds of secure "network processing"
        setTimeout(() => {
            handlePaymentSuccess('mock_pi_1234567890');
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-bold text-slate-900">Virtual Credit Card Validation</p>
                    <Lock className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
                        <input required type="text" name="number" placeholder="4111 1111 1111 1111" onChange={handleChange} maxLength="16" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-slate-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                            <input required type="text" name="expiry" placeholder="MM/YY" onChange={handleChange} maxLength="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-slate-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                            <input required type="text" name="cvc" placeholder="123" onChange={handleChange} maxLength="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-slate-700" />
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
                {isProcessing ? (
                    <><Loader className="w-5 h-5 animate-spin" /> <span>Authenticating securely...</span></>
                ) : (
                    <><CreditCard className="w-5 h-5" /> <span>Confirm & Pay {formatPrice(amount)}</span></>
                )}
            </button>
        </form>
    );
};

export default PaymentForm;
