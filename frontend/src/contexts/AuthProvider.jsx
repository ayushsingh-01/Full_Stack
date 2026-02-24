import { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import { getCurrentUser, logoutUser } from '../api/authAPI'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser()
      if (response?.user) {
        setUser(response.user)
        setIsAuthenticated(true)
        
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
      }
    } catch {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await logoutUser()
      
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
