import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    tokens: {
        type: Number,
        required: true,
    },

    bonusTokens: {
        type: Number,
        default: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);

export default Plan;
