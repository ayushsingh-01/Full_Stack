import crypto from 'crypto';
import getRazorpayClient from '../config/razorpay.js';
import Plan from '../models/plan.js';
import Order from '../config/order.js';
import User from '../models/user.js';

// Get all active plans
export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
        res.json({ success: true, plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch plans' });
    }
};

// Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user.id;

        
        const plan = await Plan.findById(planId);
        if (!plan || !plan.isActive) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        
        const options = {
            amount: plan.price * 100, 
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                planId: plan._id.toString(),
                userId: userId,
                tokens: plan.tokens + plan.bonusTokens
            }
        };

        const razorpay = getRazorpayClient();
        const razorpayOrder = await razorpay.orders.create(options);

       
        const order = new Order({
            user: userId,
            plan: plan._id,
            amount: plan.price,
            tokens: plan.tokens + plan.bonusTokens,
            razorpay_order_id: razorpayOrder.id,
            status: 'created'
        });

        await order.save();

        res.json({
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                planName: plan.name,
                tokens: plan.tokens + plan.bonusTokens
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;

        
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        
        const order = await Order.findOne({ razorpay_order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        order.status = 'paid';
        await order.save();

        
        const user = await User.findById(userId);
        user.tokens = (user.tokens || 0) + order.tokens;
        await user.save();

        res.json({
            success: true,
            message: 'Payment verified successfully',
            tokens: user.tokens
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};


export const getUserTokens = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('tokens');
        
        res.json({
            success: true,
            tokens: user.tokens || 0
        });
    } catch (error) {
        console.error('Error fetching user tokens:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tokens' });
    }
};
