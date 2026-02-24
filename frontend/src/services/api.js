import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url === '/auth/me' && error.response?.status === 401) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export const initiateSignup = async (email) => {
  const response = await api.post('/auth/signup/initiate', { email })
  return response.data
}

export const verifySignupOtp = async (email, otp, name, password, role = 'user') => {
  const response = await api.post('/auth/signup/verify', {
    email,
    otp,
    name,
    password,
    role
  })
  return response.data
}

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data.user
  } catch {
    return null
  }
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export default api
