import { useState } from 'react';
import styles from './chats.module.css';
import { Modal } from '../modal';
import { ModalAddChat } from '../modalAddChat';
import { Chat, User } from '../../types';
import { formatDateForList, getLastMessage } from '../../utils';

interface ChatsProps {
  user: User | null;
  chats: Chat[];
  handleChatSelect: (chat: Chat) => void;
  handleNewChat: (chatData: {
    firstName: string;
    lastName: string;
    userId: string;
  }) => void;
}

export const Chats = ({
  user,
  handleChatSelect,
  chats,
  handleNewChat,
}: ChatsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.firstName} ${chat.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Chats</h2>
        <button className={styles.button} onClick={toggleModal}>
          Create chat
        </button>
      </div>
      <input
        type="text"
        placeholder="Search chats..."
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredChats.map((chat) => (
          <li
            key={chat._id}
            className={styles.chatItem}
            onClick={() => handleChatSelect(chat)}
          >
            <img src="/user.png" alt="User avatar" className={styles.avatar} />
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
