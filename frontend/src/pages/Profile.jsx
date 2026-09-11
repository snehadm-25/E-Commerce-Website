import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Home, MapPin, Building, Loader, CheckCircle, Camera } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '', // Email usually not editable, but we show it
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        postalCode: user?.postalCode || '',
        avatar: user?.avatar || '',
        password: '',
    });

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataData = new FormData();
        formDataData.append('image', file);

        setUploadingAvatar(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formDataData, config);
            setFormData(prev => ({ ...prev, avatar: data.data }));
            setSuccessMessage('Avatar uploaded! Please click "Save Profile Changes" to store it permanently.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image.');
        }
        setUploadingAvatar(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        const res = await updateProfile({
            ...formData,
            // Only send password if they typed it
            password: formData.password || undefined
        });

        if (res.success) {
            setSuccessMessage('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '' })); // clear password field
        } else {
            setError(res.message);
        }
        setIsSubmitting(false);

        setTimeout(() => setSuccessMessage(''), 4000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Update your account details and shipping address.</p>
            </div>

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r-md flex items-center">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-3" />
                    <p className="text-sm text-green-700 font-bold">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-md">
                    <p className="text-sm text-red-700 font-bold">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Account Settings */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center border-b border-slate-100 pb-3">
                        <User className="w-5 h-5 mr-3 text-blue-600" /> Account Settings
                    </h2>

                    <div className="flex flex-col items-center mb-6 pt-2 pb-6 border-b border-slate-100">
                        <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm bg-blue-100 flex items-center justify-center">
                            {formData.avatar ? (
                                <img src={'http://localhost:5000' + formData.avatar} alt="Profile preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-blue-500" />
                            )}

                            <label className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {uploadingAvatar ? <Loader className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                                <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 mt-3">Click to upload avatar</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-300" />
                            </div>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-300" />
                            </div>
                            <input type="email" name="email" value={formData.email} disabled className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed" title="Email cannot be changed" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-300" />
                            </div>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-300" placeholder="e.g. +1 234 567 8900" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Reset Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-300" placeholder="Enter new password (optional)" />
                        <p className="text-xs text-slate-400 mt-2">Leave blank to keep your current password.</p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center border-b border-slate-100 pb-3">
                        <Home className="w-5 h-5 mr-3 text-blue-600" /> Shipping Address
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Street Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-slate-300" />
                            </div>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="123 Main St" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-slate-300" />
                                </div>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="New York" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">State / Province</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="NY" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Postal / Zip Code</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="10001" />
                    </div>
                </div>

                <div className="md:col-span-2 pt-6 mt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <Loader className="animate-spin h-5 w-5" />
                        ) : (
                            'Save Profile Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
