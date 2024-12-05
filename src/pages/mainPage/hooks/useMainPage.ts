import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chat, User } from '../../../types';

const BASE_URL = import.meta.env.VITE_API_URL;

export const useMainPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios
        .get(`${BASE_URL}/api/users/${userId}`)
        .then((response) => setUser(response.data))
        .catch((error) => console.error(error));
    }
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chats`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = async (chatData: {
    firstName: string;
    lastName: string;
    userId: string;
  }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/chats`, chatData);
      setChats((prevChats) => [...prevChats, response.data]);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return {
    user,
    chats,
    selectedChat,
    handleChatSelect,
    handleNewChat,
    setChats,
  };
};
