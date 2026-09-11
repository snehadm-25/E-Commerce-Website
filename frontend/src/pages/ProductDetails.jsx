import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Star, StarHalf, Truck, ShieldCheck, Check, Heart } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, toggleWishlist } = useAuth();
    const { addToCart } = useCart();

    const [wishlistLoading, setWishlistLoading] = useState(false);

    // We compute this after fetching product
    const isWishlisted = isAuthenticated && user?.wishlist?.includes(id);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate('/login');
        setWishlistLoading(true);
        await toggleWishlist(id);
        setWishlistLoading(false);
    };

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data);
            setRating(5);
            setComment('');
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.data);
            } catch (err) {
                setError('Product not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
            return;
        }

        await addToCart(product._id, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    if (loading) return (
        <div className="flex justify-center p-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !product) return (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{error || 'Product Not Found'}</h3>
            <Link to="/products" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Products
            </Link>
        </div>
    );

    return (
        <div className="pb-16 pt-4">
            <Link to="/products" className="inline-flex items-center text-slate-500 font-semibold hover:text-slate-900 transition mb-8">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Products
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    {/* Image */}
                    <div className="aspect-square lg:aspect-auto w-full h-[400px] lg:h-[600px] bg-slate-100 relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                        {product.stock === 0 && (
                            <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-4 flex items-center space-x-2 text-sm font-semibold text-blue-600 uppercase tracking-wider">
                            <span>{product.category}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-6">
                            <div className="flex items-center text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    product.rating >= star ? <Star key={star} className="w-5 h-5 fill-current" /> :
                                        product.rating >= star - 0.5 ? <StarHalf key={star} className="w-5 h-5 fill-current" /> :
                                            <Star key={star} className="w-5 h-5 text-slate-300" />
                                ))}
                            </div>
                            <span className="ml-3 text-sm font-medium text-slate-500">
                                {product.rating} / 5.0 Rating
                            </span>
                        </div>

                        <div className="flex flex-col mb-8 border-b border-slate-100 pb-8">
                            <div className="flex items-end space-x-3">
                                <span className="text-4xl font-extrabold text-slate-900 leading-none">
                                    {formatPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl font-bold text-slate-400 line-through mb-1">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                            {hasDiscount && (
                                <span className="mt-3 inline-flex w-max items-center justify-center px-3 py-1 text-sm font-bold text-pink-700 bg-pink-100 rounded-full">
                                    {discountPercentage}% OFF Special Discount
                                </span>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Description</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-base">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-slate-900">Quantity</h3>
                                <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `${product.stock} in Stock` : 'Currently Unavailable'}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    disabled={product.stock === 0}
                                    className="block w-24 pl-3 pr-10 py-3 text-base border border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                                >
                                    {[...Array(product.stock > 0 ? (product.stock > 10 ? 10 : product.stock) : 1).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className={`flex-shrink-0 w-14 h-[52px] flex items-center justify-center border border-slate-200 rounded-xl transition-all duration-200 ${isWishlisted ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'bg-white hover:bg-red-50 hover:border-red-100'}`}
                                >
                                    <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex justify-center items-center py-3.5 px-8 border border-transparent text-base font-bold rounded-xl text-white transition-all duration-300 shadow-md ${added ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed`}
                                >
                                    {added ? (
                                        <><Check className="w-5 h-5 mr-2" /> Added to Cart</>
                                    ) : (
                                        <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-6 grid grid-cols-2 gap-4">
                            <div className="flex items-center text-slate-500">
                                <Truck className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">Fast Delivery</span>
                            </div>
                            <div className="flex items-center text-slate-500">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">1 Year Warranty</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-12">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Customer Reviews</h2>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    <div>
                        {(!product.reviews || product.reviews.length === 0) ? (
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                                <p className="text-slate-500 font-medium">No reviews yet. Be the first to review this product!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="border-b border-slate-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <strong className="text-slate-900 font-bold text-sm">{review.name}</strong>
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex text-yellow-400 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                review.rating >= star ? <Star key={star} className="w-3 h-3 fill-current" /> :
                                                    review.rating >= star - 0.5 ? <StarHalf key={star} className="w-3 h-3 fill-current" /> :
                                                        <Star key={star} className="w-3 h-3 text-slate-300" />
                                            ))}
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-10 lg:mt-0">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Customer Review</h3>

                            {!isAuthenticated ? (
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-semibold border border-blue-100">
                                    Please <Link to="/login" className="underline hover:text-blue-900">sign in</Link> to write a review.
                                </div>
                            ) : (
                                <form onSubmit={submitReviewHandler}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 focus:outline-none"
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows="4"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 focus:outline-none"
                                            placeholder="What did you like or dislike about this product?"
                                        ></textarea>
                                    </div>
                                    {reviewError && (
                                        <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                                            {reviewError}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={reviewLoading}
                                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                                    >
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
