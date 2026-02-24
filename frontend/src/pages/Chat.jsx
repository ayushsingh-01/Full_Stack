import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useAuth } from '../contexts/AuthProvider';
import { ThemeContext } from '../components/ThemeContext';
import { getUsers, getConversations, getMessages, getOrCreateConversation } from '../api/messageAPI';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Chat = () => {
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }
  }, []);

  // Fetch users and conversations on mount
  useEffect(() => {
    if (!user?.id) return;
    
    let mounted = true;
    
    const initializeChat = async () => {
      try {
        const [usersData, conversationsData] = await Promise.all([
          getUsers(),
          getConversations()
        ]);
        
        if (mounted) {
          setUsers(usersData.users || []);
          setConversations(conversationsData.conversations || []);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
    
    return () => {
      mounted = false;
    };
  }, [user]);

  
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      if (message.conversation === selectedConversation?._id) {
        setMessages(prev => [...prev, message]);
      }
      
      fetchConversations();
    });

    socket.on('message-sent', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user-typing', ({ conversationId }) => {
      if (conversationId === selectedConversation?._id) {
        setIsTyping(true);
      }
    });

    socket.on('user-stopped-typing', ({ conversationId }) => {
      if (conversationId === selectedConversation?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('receive-message');
      socket.off('message-sent');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [socket, selectedConversation, fetchConversations]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectUser = async (selectedUser) => {
    try {
      setLoading(true);
      const data = await getOrCreateConversation(selectedUser._id);
      setSelectedConversation(data.conversation);
      
      
      const messagesData = await getMessages(data.conversation._id);
      setMessages(messagesData.messages);
      
     
      await fetchConversations();
      
      setLoading(false);
    } catch (error) {
      console.error('Error selecting user:', error);
      toast.error(error.response?.data?.message || 'Failed to load conversation');
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      setLoading(true);
      setSelectedConversation(conversation);
      
      const data = await getMessages(conversation._id);
      setMessages(data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const otherUser = getOtherUser(selectedConversation);
    if (!otherUser) return;

    socket.emit('send-message', {
      conversationId: selectedConversation._id,
      receiverId: otherUser._id,
      content: newMessage.trim()
    });

    setNewMessage('');
    
    
    socket.emit('stop-typing', {
      receiverId: otherUser._id,
      conversationId: selectedConversation._id
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedConversation) return;

    const otherUser = getOtherUser(selectedConversation);
    if (!otherUser) return;

    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    
    socket.emit('typing', {
      receiverId: otherUser._id,
      conversationId: selectedConversation._id
    });

    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', {
        receiverId: otherUser._id,
        conversationId: selectedConversation._id
      });
    }, 2000);
  };

  const getOtherUser = (conversation) => {
    if (!conversation?.participants || !user?.id) return null;
    return conversation.participants.find(p => p._id !== user.id);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  
  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ height: 'calc(100vh - 150px)' }}>
          <div className="grid grid-cols-12 h-full">
            
            {/* Sidebar - Users & Conversations */}
            <div className={`col-span-12 md:col-span-4 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r overflow-y-auto`}>
              
              {/* Header */}
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Messages
                </h2>
              </div>

              {/* Conversations List */}
              {conversations.length > 0 && (
                <div className="p-2">
                  <h3 className={`text-sm font-semibold px-2 py-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recent Chats
                  </h3>
                  {conversations
                    .filter(conv => getOtherUser(conv))
                    .map((conv) => {
                      const otherUser = getOtherUser(conv);
                      if (!otherUser) return null;
                      const isOnline = isUserOnline(otherUser._id);
                      const isSelected = selectedConversation?._id === conv._id;

                      return (
                        <button
                          key={conv._id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                            isSelected
                              ? isDark ? 'bg-blue-600' : 'bg-blue-500 text-white'
                              : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                                  <span className={`font-semibold ${isSelected ? 'text-white' : isDark ? 'text-white' : 'text-gray-700'}`}>
                                    {otherUser.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div>
                                <p className={`font-semibold ${isSelected ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {otherUser.name}
                                </p>
                                <p className={`text-sm ${isSelected ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {otherUser.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}

              {/* All Users */}
              <div className="p-2">
                <h3 className={`text-sm font-semibold px-2 py-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  All Users
                </h3>
                {users.map((u) => {
                  const isOnline = isUserOnline(u._id);
                  
                  return (
                    <button
                      key={u._id}
                      onClick={() => handleSelectUser(u)}
                      className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {u.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {u.role}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-12 md:col-span-8 flex flex-col">
              
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    {(() => {
                      const otherUser = getOtherUser(selectedConversation);
                      
                      if (!otherUser) {
                        return (
                          <div className="flex items-center space-x-3">
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Invalid conversation
                            </p>
                          </div>
                        );
                      }
                      
                      const isOnline = isUserOnline(otherUser._id);
                      
                      return (
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                {otherUser.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {otherUser.name}
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Messages */}
                  <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading messages...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isSender = message.sender._id === user.id;
                        
                        return (
                          <div key={message._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isSender ? 'order-2' : 'order-1'}`}>
                              <div className={`rounded-lg p-3 ${
                                isSender
                                  ? 'bg-blue-500 text-white'
                                  : isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                              }`}>
                                <p className="wrap-break-word">{message.content}</p>
                                <p className={`text-xs mt-1 ${isSender ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div className="flex space-x-2">
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-600'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className={`mt-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>No conversation selected</h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Choose a user from the sidebar to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
