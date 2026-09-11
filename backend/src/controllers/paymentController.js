import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

export const createPaymentIntent = async (req, res, next) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ success: false, message: 'Stripe Secret Key is securely required for real-world checkout endpoints. Please add STRIPE_SECRET_KEY to your backend .env file to enable Checkout.' });
        }

        const { amount } = req.body; // Amount should be passed in smallest currency unit (paise for INR)

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid payment amount' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret
            },
        });
    } catch (error) {
        next(error);
    }
};
