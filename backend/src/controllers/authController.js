import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    postalCode: user.postalCode,
                    avatar: user.avatar,
                    wishlist: user.wishlist || [],
                    token: generateToken(user._id),
                },
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    postalCode: user.postalCode,
                    avatar: user.avatar,
                    wishlist: user.wishlist || [],
                    token: generateToken(user._id),
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    postalCode: user.postalCode,
                    avatar: user.avatar,
                    wishlist: user.wishlist || [],
                },
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.postalCode = req.body.postalCode || user.postalCode;
            if (req.body.avatar !== undefined) {
                user.avatar = req.body.avatar;
            }

            // Optional password update
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    city: updatedUser.city,
                    state: updatedUser.state,
                    postalCode: updatedUser.postalCode,
                    avatar: updatedUser.avatar,
                    wishlist: updatedUser.wishlist || [],
                    token: generateToken(updatedUser._id),
                },
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const logoutUser = (req, res) => {
    // Since JWT is stateless and stored on client side, we simply send back a success
    // so frontend clears the token
    res.json({ success: true, message: 'User logged out successfully' });
};

// Admin endpoints
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ success: true, message: 'User removed' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const toggleWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.body;

        if (user) {
            user.wishlist = [...new Set((user.wishlist || []).map(id => id.toString()))];
            const index = user.wishlist.findIndex(id => id.toString() === String(productId));

            if (index !== -1) {
                user.wishlist.splice(index, 1);
            } else {
                user.wishlist.push(productId);
            }

            await user.save();
            res.json({ success: true, data: user.wishlist });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};
