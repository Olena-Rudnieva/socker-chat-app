import { useEffect, useState } from 'react';
import { ChatRoom, Chats, Header } from '../../components';
import { Chat, User } from '../../types';
import styles from './mainPage.module.css';
import axios from 'axios';
// import { BASE_URL } from '../../constants/api';

const BASE_URL = import.meta.env.VITE_API_URL;

const MainPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios
        .get(`${BASE_URL}/api/users/${userId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
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

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    setSelectedChat(chats[0]);
  }, [chats]);

  const handleNewChat = async (chatData: {
    firstName: string;
    lastName: string;
    userId: string;
  }) => {
    try {
      const response = await axios.post('/api/chats', chatData);
      setChats((prevChats) => [...prevChats, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftside}>
        <Header user={user} />
        <Chats
          user={user}
          chats={chats}
          handleChatSelect={handleChatSelect}
          handleNewChat={handleNewChat}
        />
      </div>
      <div className={styles.rightside}>
        <ChatRoom chat={selectedChat} user={user} setChats={setChats} />
      </div>
    </div>
  );
};

export default MainPage;
