import { useEffect, useState } from 'react';

import styles from './chats.module.css';
import { Modal } from '../modal';
import { ModalAddChat } from '../modalAddChat';
import { Chat, User } from '../../types';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { formatDateForList, getLastMessage } from '../../utils';

interface ChatsProps {
  user: User | null;
  handleChatSelect: (chat: Chat) => void;
}

export const Chats = ({ user, handleChatSelect }: ChatsProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

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
    <div>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Chats</h2>
        <button className={styles.button} onClick={toggleModal}>
          Create chat
        </button>
      </div>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={styles.chatItem}
            onClick={() => handleChatSelect(chat)}
          >
            <img
              src="https://via.placeholder.com/50"
              alt="User avatar"
              className={styles.avatar}
            />
            <div className={styles.chatContent}>
              <div className={styles.userInfo}>
                <strong>
                  {chat.firstName} {chat.lastName}
                </strong>
                <span className={styles.lastMessageDate}>
                  {formatDateForList(getLastMessage(chat)?.timestamp || '')}
                </span>
              </div>
              <p className={styles.lastMessage}>
                {getLastMessage(chat)?.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <ModalAddChat
            handleModalToggle={toggleModal}
            user={user}
            handleNewChat={handleNewChat}
          />
        </Modal>
      )}
    </div>
  );
};
