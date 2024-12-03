import { useEffect, useState } from 'react';
import { ChatRoom, Chats, Header } from '../../components';
import { Chat, User } from '../../types';
import styles from './mainPage.module.css';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';

const MainPage = () => {
  const [user, setUser] = useState<User | null>(null);
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

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftside}>
        <Header user={user} />
        <Chats user={user} handleChatSelect={handleChatSelect} />
      </div>
      <div className={styles.rightside}>
        <ChatRoom chat={selectedChat} user={user} />
      </div>
    </div>
  );
};

export default MainPage;
