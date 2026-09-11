import express from 'express';
import { body } from 'express-validator';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    logoutUser,
    getAllUsers,
    deleteUser,
    toggleWishlist
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    registerUser
);

router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/wishlist', protect, toggleWishlist);
router.post('/logout', logoutUser);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
