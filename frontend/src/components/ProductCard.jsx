import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isAuthenticated, user, toggleWishlist } = useAuth();
    const navigate = useNavigate();

    const [wishlistLoading, setWishlistLoading] = useState(false);

    const isWishlisted = isAuthenticated && user?.wishlist?.includes(product._id);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return navigate('/login');
        setWishlistLoading(true);
        await toggleWishlist(product._id);
        setWishlistLoading(false);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
            return;
        }
        await addToCart(product._id, 1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative">

            {/* Wishlist Button Overlay */}
            <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="absolute top-3 left-3 z-50 p-2.5 bg-white/90 backdrop-blur shadow-sm rounded-full text-slate-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
            >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
            </button>

            <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Out of Stock
                    </div>
                )}
                {product.stock > 0 && hasDiscount && (
                    <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                        {discountPercentage}% OFF
                    </div>
                )}
                {product.featured && product.stock > 0 && !hasDiscount && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </div>
                )}
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</p>
                    <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs text-slate-500 ml-1 font-medium">{product.rating}</span>
                    </div>
                </div>

                <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-slate-900 leading-none">
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs font-medium text-slate-400 line-through mt-1">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="bg-slate-100 p-2.5 rounded-full text-slate-700 hover:bg-blue-600 hover:text-white disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-all duration-200 z-10"
                        aria-label="Add to cart"
                        title="Add to cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
