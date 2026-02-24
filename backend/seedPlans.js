import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './src/models/plan.js';

dotenv.config();

const seedPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        
        const plans = [
            {
                name: 'Basic',
                price: 99,
                tokens: 100,
                bonusTokens: 10,
                isActive: true
            },
            {
                name: 'Pro',
                price: 299,
                tokens: 500,
                bonusTokens: 100,
                isActive: true
            },
            {
                name: 'Premium',
                price: 599,
                tokens: 1200,
                bonusTokens: 300,
                isActive: true
            }
        ];

        for (const plan of plans) {
            await Plan.updateOne(
                { name: plan.name },
                { $set: plan },
                { upsert: true }
            );
            console.log(`Upserted plan: ${plan.name}`);
        }

        console.log('Successfully seeded 3 subscription plans');

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding plans:', error);
        process.exit(1);
    }
};

seedPlans();
