import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },

    amount: Number,
    tokens: Number,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    
    status: {
        type: String,
        enum: ['created', 'paid', 'failed'],
        default: 'created'
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
