import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getPlans, createOrder, verifyPayment, getUserTokens } from '../controllers/paymentController.js';

const router = express.Router();


router.get('/plans', getPlans);


router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.get('/tokens', authMiddleware, getUserTokens);

export default router;
