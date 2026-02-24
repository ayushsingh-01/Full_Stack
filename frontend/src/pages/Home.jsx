import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../components/ThemeContext'
import Navbar from '../components/Navbar'
import { getPlans } from '../api/paymentAPI'

function Home() {
  const { isAuthenticated, user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const [plans, setPlans] = useState([])

  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans()
        setPlans(data.plans)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      }
    }
    fetchPlans()
  }, [])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Full Stack Project
          </h1>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            A modern authentication system with OTP verification
          </p>

          {isAuthenticated ? (
            <div className={`max-w-2xl mx-auto p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                You're Logged In! 🎉
              </h2>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Welcome back, <strong>{user?.name}</strong>!
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 text-lg rounded-lg transition-colors shadow-lg ${
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-4xl mb-4">🔐</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Secure Authentication
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              OTP-based signup with email verification and secure JWT tokens
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Beautiful UI
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Modern design with Tailwind CSS and dark mode support
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Fast & Modern
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Built with React, Node.js, and MongoDB for optimal performance
            </p>
          </div>
        </div>

        {plans.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Subscription Plans
              </h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Choose the perfect plan for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`p-8 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${
                    isDark ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-500'
                  } transition-all duration-300`}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ₹{plan.price}
                    </span>
                  </div>
                  <div className="mb-6 space-y-2">
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
                  </div>
                  <Link
                    to={isAuthenticated ? '/subscription' : '/signup'}
                    className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isAuthenticated ? 'Get Started' : 'Sign Up'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
