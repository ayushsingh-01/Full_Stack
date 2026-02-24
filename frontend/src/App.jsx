import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ThemeProvider from './components/ThemeProvider'
import AuthProvider from './contexts/AuthProvider'
import { SocketProvider } from './contexts/SocketProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './pages/Dashboard'
import CreateAsset from './pages/CreateAsset'
import MyAssets from './pages/MyAssets'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Subscription from './pages/Subscription'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-asset" 
                element={
                  <ProtectedRoute>
                    <CreateAsset />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-assets" 
                element={
                  <ProtectedRoute>
                    <MyAssets />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
