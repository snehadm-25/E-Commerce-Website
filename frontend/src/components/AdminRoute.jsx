import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (isAuthenticated && user?.role === 'admin') {
        return children;
    }

    return <Navigate to="/login" />;
};

export default AdminRoute;
