import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthProvider';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      
      const token = localStorage.getItem('token');
      
      if (token) {
        
        const newSocket = io('http://localhost:5000', {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Socket connected');
        });

        
        newSocket.on('user-online', (userId) => {
          setOnlineUsers(prev => {
            if (!prev.includes(userId)) {
              return [...prev, userId];
            }
            return prev;
          });
        });

        newSocket.on('user-offline', (userId) => {
          setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
