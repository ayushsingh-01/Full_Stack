import axiosInstance from './axiosInstance';

export const getPlans = async () => {
    const response = await axiosInstance.get('/payment/plans');
    return response.data;
};

export const createOrder = async (planId) => {
    const response = await axiosInstance.post('/payment/create-order', { planId });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await axiosInstance.post('/payment/verify-payment', paymentData);
    return response.data;
};

export const getUserTokens = async () => {
    const response = await axiosInstance.get('/payment/tokens');
    return response.data;
};
