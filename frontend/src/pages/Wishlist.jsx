import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
    const { user } = useAuth();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                let wishlistIds = user?.wishlist || [];
                if (!Array.isArray(wishlistIds)) {
                    wishlistIds = Array.from(wishlistIds);
                }

                if (wishlistIds.length === 0) {
                    setWishlistProducts([]);
                    setLoading(false);
                    return;
                }

                const productPromises = wishlistIds.map(id =>
                    api.get(`/products/${id}`).catch(err => null)
                );

                const results = await Promise.all(productPromises);

                // Filter out any null responses from deleted products
                const validProducts = results
                    .filter(res => res !== null && res.data && res.data.data)
                    .map(res => res.data.data);

                setWishlistProducts(validProducts);

            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to fetch wishlist');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWishlist();
        }
    }, [user?.wishlist]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4 text-slate-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                <p className="font-semibold text-lg">Loading your favorites...</p>
            </div>
        );
    }

    return (
        <div className="pb-12 max-w-7xl mx-auto">
            <div className="mb-10 text-center space-y-4 bg-red-50 rounded-[2.5rem] py-16 px-6 relative overflow-hidden">
                <Heart className="absolute -top-10 -right-10 w-96 h-96 text-red-100 opacity-50 -scale-45 fill-red-100" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-4 relative z-10">
                    <Heart className="w-10 h-10 text-red-500 fill-red-500" /> My Wishlist
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium relative z-10">
                    Your personal collection of favorite items securely saved for later.
                </p>
            </div>

            {error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <Heart className="h-20 w-20 text-slate-200 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900">Your wishlist is empty</h3>
                    <p className="text-slate-500 mt-2 mb-8 font-medium">Browse our products and click the heart icon to save them here.</p>
                    <Link
                        to="/products"
                        className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistProducts.map(product => (
                        <div key={product._id} className="relative">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
