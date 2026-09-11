import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/products');
                const featured = res.data.data.filter(p => p.featured).slice(0, 4);
                setFeaturedProducts(featured);
            } catch (err) {
                setError('Failed to load featured products');
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
                <div className="relative px-6 py-20 sm:px-12 sm:py-28 lg:px-20 flex flex-col items-start lg:w-2/3">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6 border border-blue-500/30">
                        New Collection 2026
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Elevate Your <br /> Everyday Style
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-xl font-medium">
                        Discover our curated collection of premium products designed to bring exceptional quality and style to your life.
                    </p>
                    <Link
                        to="/products"
                        className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-full hover:bg-slate-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {[
                    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹5,000' },
                    { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
                    { icon: ShoppingBag, title: 'Easy Returns', desc: '30 days return policy' },
                ].map((feat, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="p-4 bg-blue-50 rounded-full mb-4 text-blue-600">
                            <feat.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                        <p className="text-slate-500 font-medium text-sm">{feat.desc}</p>
                    </div>
                ))}
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Picks</h2>
                        <p className="text-slate-500 mt-2 font-medium">Handpicked favorites just for you.</p>
                    </div>
                    <Link to="/products" className="hidden sm:inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
                        View All <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-medium border border-red-100">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
                <div className="mt-8 text-center sm:hidden">
                    <Link to="/products" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
                        View All <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
