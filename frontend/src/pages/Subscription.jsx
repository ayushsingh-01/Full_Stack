import { useState, useEffect, useContext } from 'react';
import { getPlans, createOrder, verifyPayment, getUserTokens } from '../api/paymentAPI';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../components/ThemeContext';

const Subscription = () => {
    const [plans, setPlans] = useState([]);
    const [userTokens, setUserTokens] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const { theme } = useContext(ThemeContext);

    const isDark = theme === 'dark';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansData, tokensData] = await Promise.all([
                getPlans(),
                getUserTokens()
            ]);
            setPlans(plansData.plans);
            setUserTokens(tokensData.tokens);
        } catch (error) {
            toast.error('Failed to load data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (planId) => {
        try {
            setProcessingPayment(true);

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway');
                return;
            }

            // Create order
            const orderData = await createOrder(planId);
            if (!orderData.success) {
                toast.error(orderData.message || 'Failed to create order');
                return;
            }

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Subscription Plan',
                description: orderData.order.planName,
                order_id: orderData.order.id,
                handler: async (response) => {
                    try {
                        const verifyData = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyData.success) {
                            toast.success('Payment successful!');
                            setUserTokens(verifyData.tokens);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        toast.error('Payment verification failed');
                        console.error(error);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#3b82f6'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', () => {
                toast.error('Payment failed');
            });
            razorpay.open();
        } catch (error) {
            toast.error('Failed to process payment');
            console.error(error);
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navbar />
            <div className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Choose Your Plan
                        </h1>
                        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Current Tokens: <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{userTokens}</span>
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan._id}
                                className={`rounded-lg shadow-lg p-8 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                <div className="mb-6">
                                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline mb-4">
                                        <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            ₹{plan.price}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6 grow">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                {plan.tokens} Tokens
                                            </span>
                                        </div>
                                        {plan.bonusTokens > 0 && (
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                    +{plan.bonusTokens} Bonus Tokens
                                                </span>
                                            </div>
                                        )}
                                        <div className={`pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <p className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                Total: {plan.tokens + plan.bonusTokens} Tokens
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePurchase(plan._id)}
                                    disabled={processingPayment}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {processingPayment ? 'Processing...' : 'Purchase'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
