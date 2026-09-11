import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [keyword, setKeyword] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                PremiumStore
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={submitHandler} className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-5 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
              />
              <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-slate-400 hover:text-blue-500">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex md:items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="relative p-2 text-slate-500 hover:text-red-500 transition duration-200 hover:bg-slate-50 rounded-full mr-2">
                  <Heart className="h-6 w-6" />
                  {user?.wishlist?.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm">
                      {user.wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative p-2 text-slate-500 hover:text-blue-600 transition duration-200 hover:bg-slate-50 rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-blue-600 font-bold hover:text-blue-800 px-3 py-2 text-sm transition duration-200 mr-2 bg-blue-50 rounded-full">
                    Admin Panel
                  </Link>
                )}
                <Link to="/orders" className="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition duration-200 mr-2">
                  Orders
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-100 transition duration-200">
                  {user?.avatar ? (
                    <img src={'http://localhost:5000' + user.avatar} alt="Avatar" className="h-5 w-5 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-blue-500" />
                  )}
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition duration-200 font-medium text-sm p-2 hover:bg-red-50 rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition duration-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden space-x-4">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-slate-500 hover:text-blue-600">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white transform bg-blue-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg absolute w-full left-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-4 pb-2 border-t border-slate-100">
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 mb-1 rounded-md text-base font-bold text-blue-700 bg-blue-50 hover:text-blue-800 hover:bg-blue-100">
                  Admin Panel
                </Link>
              )}
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 mb-1 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50">
                My Orders
              </Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 mb-1 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition duration-200">
                <UserIcon className="h-5 w-5 mr-3" />
                <span className="text-base font-bold text-slate-800 hover:text-blue-600">Profile ({user?.name})</span>
              </Link>
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-3 px-3 mt-2">
              <Link
                to="/login"
                className="block text-center w-full bg-slate-100 text-slate-800 px-4 py-3 rounded-xl font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
