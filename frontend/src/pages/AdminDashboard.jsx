import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, PackageSearch, ClipboardList, TrendingUp, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, userCount: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeTab === 'products' || activeTab === 'overview') {
                    const res = await api.get('/products');
                    setProducts(res.data.data);
                }
                if (activeTab === 'orders' || activeTab === 'overview') {
                    const res = await api.get('/orders/all');
                    setOrders(res.data.data);

                    const total = res.data.data.reduce((acc, order) => acc + order.totalAmount, 0);
                    setStats(prev => ({ ...prev, totalSales: total, orderCount: res.data.data.length }));
                }
                if (activeTab === 'users' || activeTab === 'overview') {
                    const res = await api.get('/auth/users');
                    setUsersList(res.data.data);
                    setStats(prev => ({ ...prev, userCount: res.data.data.length }));
                }
            } catch (err) {
                console.error('Admin fetch error', err);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleOrderStatusUpdate = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            // Refresh orders
            const res = await api.get('/orders/all');
            setOrders(res.data.data);
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/auth/users/${id}`);
                setUsersList(prev => prev.filter(u => u._id !== id));
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: TrendingUp },
        { id: 'products', name: 'Products', icon: PackageSearch },
        { id: 'orders', name: 'Orders', icon: ClipboardList },
        { id: 'users', name: 'Users', icon: Users },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                    Administrator Dashboard
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Welcome back, {user?.name}. Manage your store here.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 custom-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 font-semibold text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`} />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Store Overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                                    <p className="text-sm font-bold text-slate-500 uppercase">Total Sales</p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{formatPrice(stats.totalSales)}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                                    <p className="text-sm font-bold text-slate-500 uppercase">Orders</p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.orderCount}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                                    <p className="text-sm font-bold text-slate-500 uppercase">Customers</p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.userCount}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Product Inventory</h2>
                                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition text-sm">
                                    + Add New Product
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="py-4 pr-4">Product</th>
                                            <th className="py-4 px-4">Price</th>
                                            <th className="py-4 px-4">Category</th>
                                            <th className="py-4 px-4">Stock</th>
                                            <th className="py-4 pl-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map((product) => (
                                            <tr key={product._id} className="hover:bg-slate-50">
                                                <td className="py-4 pr-4 flex items-center space-x-3">
                                                    <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                    <span className="font-semibold text-sm text-slate-800">{product.name}</span>
                                                </td>
                                                <td className="py-4 px-4 text-sm font-medium">{formatPrice(product.price)}</td>
                                                <td className="py-4 px-4 text-sm">{product.category}</td>
                                                <td className="py-4 px-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-md font-bold text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {product.stock > 0 ? product.stock : 'Out'}
                                                    </span>
                                                </td>
                                                <td className="py-4 pl-4 text-right space-x-2">
                                                    <button className="text-slate-400 hover:text-blue-600 p-1"><Edit className="w-4 h-4" /></button>
                                                    <button className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Management</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="py-4 pr-4">Order ID</th>
                                            <th className="py-4 px-4">Customer</th>
                                            <th className="py-4 px-4">Date</th>
                                            <th className="py-4 px-4">Payment</th>
                                            <th className="py-4 px-4">Total</th>
                                            <th className="py-4 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-slate-50">
                                                <td className="py-4 pr-4 font-mono text-xs text-slate-500">{order._id.substring(18, 24)}</td>
                                                <td className="py-4 px-4">
                                                    <p className="font-semibold text-sm text-slate-800">{order.user?.name || 'Deleted User'}</p>
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${order.paymentMethod === 'Cash On Delivery' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {order.paymentMethod === 'Cash On Delivery' ? 'COD' : 'Card'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-sm">{formatPrice(order.totalAmount)}</td>
                                                <td className="py-4 px-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                                        className={`text-xs font-bold px-2 py-1 rounded-md border-0 focus:ring-2 focus:ring-blue-500 ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'returned' ? 'bg-purple-100 text-purple-800' :
                                                                order.status === 'return requested' ? 'bg-pink-100 text-pink-800' :
                                                                    order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                            'bg-slate-100 text-slate-800'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="return requested">Return Request</option>
                                                        <option value="returned">Returned</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">User Database</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="py-4 pr-4">Name</th>
                                            <th className="py-4 px-4">Email</th>
                                            <th className="py-4 px-4">Role</th>
                                            <th className="py-4 pl-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {usersList.map((usr) => (
                                            <tr key={usr._id} className="hover:bg-slate-50">
                                                <td className="py-4 pr-4 font-semibold text-sm text-slate-800">{usr.name}</td>
                                                <td className="py-4 px-4 text-sm text-slate-600">{usr.email}</td>
                                                <td className="py-4 px-4">
                                                    {usr.role === 'admin' ? (
                                                        <span className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md w-max">
                                                            <CheckCircle className="w-3 h-3 mr-1" /> Admin
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                            Customer
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 pl-4 text-right">
                                                    {usr._id !== user._id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(usr._id)}
                                                            className="text-slate-400 hover:text-red-600 p-1 ml-2 transition"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
