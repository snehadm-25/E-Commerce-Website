import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse URL params
    const queryParams = new URLSearchParams(location.search);
    const keywordFromUrl = queryParams.get('keyword') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [keyword, setKeyword] = useState(keywordFromUrl);

    // Sort State
    const [sort, setSort] = useState('newest');

    // Checkbox Categories State
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Price Range State
    const [priceRange, setPriceRange] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Hardcoded unique categories for filter
    const categoriesList = ['Electronics', 'Home', 'Clothing', 'Fitness', 'Books', 'Accessories'];

    const priceRanges = [
        { label: 'Any Price', min: '', max: '', id: 'any' },
        { label: 'Under ₹1,000', min: '0', max: '1000', id: 'range1' },
        { label: '₹1,000 - ₹5,000', min: '1000', max: '5000', id: 'range2' },
        { label: '₹5,000 - ₹20,000', min: '5000', max: '20000', id: 'range3' },
        { label: 'Over ₹20,000', min: '20000', max: '', id: 'range4' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (page) params.append('pageNumber', page);
                if (keywordFromUrl) params.append('keyword', keywordFromUrl);
                if (selectedCategories.length > 0) params.append('category', selectedCategories.join(','));
                if (minPrice !== '') params.append('minPrice', minPrice);
                if (maxPrice !== '') params.append('maxPrice', maxPrice);
                if (sort !== 'newest') params.append('sort', sort);

                let uri = '/products';
                const queryStr = params.toString();
                if (queryStr) uri += `?${queryStr}`;

                const res = await api.get(uri);
                setProducts(res.data.data);
                setPage(res.data.page);
                setPages(res.data.pages);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keywordFromUrl, page, selectedCategories, minPrice, maxPrice, sort]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        if (keyword.trim()) {
            navigate(`/products?keyword=${keyword}`);
        } else {
            navigate('/products');
        }
    };

    const handleCategoryToggle = (cat) => {
        setPage(1);
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handlePriceChange = (rangeId) => {
        setPage(1);
        setPriceRange(rangeId);
        const range = priceRanges.find(r => r.id === rangeId);
        setMinPrice(range.min);
        setMaxPrice(range.max);
    };

    const clearFilters = () => {
        setKeyword('');
        setSelectedCategories([]);
        setPriceRange('any');
        setMinPrice('');
        setMaxPrice('');
        setSort('newest');
        setPage(1);
        navigate('/products');
    };

    return (
        <div className="pb-12">
            <div className="mb-10 text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Our Collection</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Browse our full range of premium products tailored for your lifestyle.</p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white p-3 rounded-xl font-bold"
                >
                    <Filter className="w-5 h-5" />
                    <span>Show Filters</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className={`fixed inset-0 z-50 lg:static lg:block lg:w-64 flex-shrink-0 bg-white lg:bg-transparent ${showMobileFilters ? 'block' : 'hidden'}`}>
                    <div className="h-full overflow-y-auto p-6 lg:p-0">
                        <div className="flex justify-between items-center lg:hidden mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-white lg:border lg:border-slate-100 lg:shadow-sm lg:rounded-3xl lg:p-6 space-y-8">

                            {/* Categories */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    Categories
                                </h3>
                                <div className="space-y-3">
                                    {categoriesList.map(cat => (
                                        <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryToggle(cat)}
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
                                            />
                                            <span className="text-slate-600 font-medium group-hover:text-slate-900 transition">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Price Ranges */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">
                                    Price Range
                                </h3>
                                <div className="space-y-3">
                                    {priceRanges.map(range => (
                                        <label key={range.id} className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                value={range.id}
                                                checked={priceRange === range.id || (range.id === 'any' && priceRange === '')}
                                                onChange={() => handlePriceChange(range.id)}
                                                className="w-5 h-5 border-slate-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
                                            />
                                            <span className="text-slate-600 font-medium group-hover:text-slate-900 transition">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Product Grid */}
                <main className="flex-1">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:text-sm font-medium shadow-sm"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>

                        <div className="flex items-center space-x-4">
                            <select
                                value={sort}
                                onChange={(e) => { setPage(1); setSort(e.target.value); }}
                                className="block w-40 pl-3 pr-10 py-3 text-sm border border-slate-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm cursor-pointer"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            <p className="text-slate-500 font-medium hidden sm:block">
                                Showing page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{pages}</strong>
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl font-medium text-center">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                            <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-6 text-blue-600 font-semibold hover:text-blue-700 underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {pages > 1 && (
                                <div className="flex justify-center items-center space-x-2 bg-white py-4 px-6 rounded-2xl shadow-sm border border-slate-100 inline-flex mx-auto">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {[...Array(pages).keys()].map(x => (
                                        <button
                                            key={x + 1}
                                            onClick={() => setPage(x + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-200 ${x + 1 === page
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {x + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pages}
                                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
