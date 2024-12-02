import { useState } from 'react';

import styles from './chats.module.css';
import { Modal } from '../modal';
import { ModalAddChat } from '../modalAddChat';

const сhats = [
  {
    id: 1,
    avatar: 'https://via.placeholder.com/50',
    firstName: 'John',
    lastName: 'Doe',
    lastMessage: 'Hello everyone!',
    lastMessageDate: '2024-11-29 14:30',
  },
  {
    id: 2,
    avatar: 'https://via.placeholder.com/50',
    firstName: 'Jane',
    lastName: 'Smith',
    lastMessage: 'Did you check the latest update?',
    lastMessageDate: '2024-11-29 13:45',
  },
  {
    id: 3,
    avatar: 'https://via.placeholder.com/50',
    firstName: 'Alex',
    lastName: 'Johnson',
    lastMessage: 'Random thoughts for today...',
    lastMessageDate: '2024-11-29 12:15',
  },
];

export const Chats = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
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
        {сhats.map((chat) => (
          <li key={chat.id} className={styles.chatItem}>
            <img
              src={chat.avatar}
              alt="User avatar"
              className={styles.avatar}
            />
            <div className={styles.chatContent}>
              <div className={styles.userInfo}>
                <strong>
                  {chat.firstName} {chat.lastName}
                </strong>
                <span className={styles.lastMessageDate}>
                  {chat.lastMessageDate}
                </span>
              </div>
              <p className={styles.lastMessage}>{chat.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <ModalAddChat handleModalToggle={toggleModal} />
        </Modal>
      )}
    </div>
  );
};
