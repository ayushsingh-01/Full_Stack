import axiosInstance from './axiosInstance';


export const getUsers = async () => {
  const response = await axiosInstance.get('/messages/users');
  return response.data;
};


export const getConversations = async () => {
  const response = await axiosInstance.get('/messages/conversations');
  return response.data;
};


export const getOrCreateConversation = async (userId) => {
  const response = await axiosInstance.get(`/messages/conversation/${userId}`);
  return response.data;
};


export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(`/messages/messages/${conversationId}`);
  return response.data;
};


export const sendMessage = async (messageData) => {
  const response = await axiosInstance.post('/messages/send', messageData);
  return response.data;
};
