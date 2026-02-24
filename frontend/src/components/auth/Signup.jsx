import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../ThemeContext'
import { sendOtp } from '../../api/authAPI'
import { successToast, errorToast } from '../../utils/toast'
import OTPVerification from './OTPVerification'

function Signup() {
  const { theme } = useContext(ThemeContext)

  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await sendOtp({ email })
      
      if (response.success) {
        successToast('OTP sent to your email!')
        setStep(2) 
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP. Please try again.'
      setError(message)
      errorToast(message)
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark'

  if (step === 2) {
    return <OTPVerification email={email} />
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Sign Up
        </h2>

        <p className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Enter your email to receive an OTP
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit}>
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
