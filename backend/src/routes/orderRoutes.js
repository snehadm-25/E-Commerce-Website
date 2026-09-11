import express from 'express';
import { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus, requestOrderReturn } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All order routes protected

router.route('/')
    .post(createOrder)
    .get(getMyOrders);

router.get('/all', admin, getAllOrders);

router.route('/:id/return')
    .put(requestOrderReturn);

router.route('/:id')
    .get(getOrderById)
    .put(admin, updateOrderStatus);

export default router;
