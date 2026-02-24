import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from './ThemeContext'

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isDark = theme === 'dark'
  const isActive = (path) => location.pathname === path

  return (
    <nav className={`shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Creators Connect
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-assets"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/my-assets')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Assets
                </Link>
                <Link
                  to="/create-asset"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/create-asset')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Create Asset
                </Link>
                <Link
                  to="/chat"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/chat')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Chat
                </Link>
                <Link
                  to="/subscription"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/subscription')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Subscription
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/')
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
