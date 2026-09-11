import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
            <div className="text-9xl font-extrabold text-slate-200 mb-8 tracking-tighter">404</div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Page Not Found</h1>
            <p className="text-xl text-slate-500 font-medium mb-10 max-w-md">
                The page you are looking for doesn't exist or has been moved to another universe.
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-slate-900 hover:bg-blue-600 transition duration-300"
            >
                <Home className="w-5 h-5 mr-3" /> Back to Homepage
            </Link>
        </div>
    );
};

export default NotFound;
