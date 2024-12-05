import { Chat, User } from '../../types';
import styles from './chatRoom.module.css';
import { FaPaperPlane } from 'react-icons/fa';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { formatDate } from '../../utils';
import { Modal } from '../modal';
import { ModalConfirmDelete } from '../modalConfirmDelete';
import { ModalEditChat } from '../modalEditChat';
import { useChatRoom } from './hooks';

interface ChatRoomProps {
  chat: Chat | null;
  user: User | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export const ChatRoom = ({ chat, user, setChats }: ChatRoomProps) => {
  const {
    messages,
    message,
    setMessage,
    isModalOpen,
    isEdit,
    messagesEndRef,
    handleSendMessage,
    toggleModal,
    closeModal,
    handleDeleteChat,
    handleUpdateChat,
  } = useChatRoom({ chat, user, setChats });

  if (!chat) {
    return <p>Please select a chat to start messaging</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperBlock}>
        <div className={styles.titleWrapper}>
          <div className={styles.image}>
            <img src="/user.png" alt="Avatar" />
          </div>
          <h3 className={styles.title}>
            {chat.firstName} {chat.lastName}
          </h3>
        </div>
        <div className={styles.icons}>
          <button
            className={styles.iconButton}
            onClick={() => toggleModal(true)}
          >
            <BsFillPencilFill />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => toggleModal(false)}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      <div className={styles.blockWrapper}>
        <ul className={styles.messagesList}>
          {messages.map((msg, index) => {
            const isOwnMessage =
              msg.sender === `${chat?.firstName} ${chat?.lastName}`;
            return (
              <li
                key={index}
                className={`${styles.messageItem} ${
                  isOwnMessage ? styles.ownMessage : styles.otherMessage
                }`}
              >
                <p className={styles.messageSender}>{msg.sender}:</p>
                <p className={styles.message}>{msg.message}</p>
                <div className={styles.timestamp}>
                  {formatDate(msg.timestamp)}
                </div>
              </li>
            );
          })}
          <div ref={messagesEndRef} />
        </ul>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className={styles.input}
          />
          <button onClick={handleSendMessage} className={styles.sendButton}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {isEdit ? (
            <ModalEditChat
              chat={chat}
              handleModalToggle={closeModal}
              handleUpdateChat={handleUpdateChat}
            />
          ) : (
            <ModalConfirmDelete
              handleModalToggle={closeModal}
              handleConfirmDelete={handleDeleteChat}
            />
          )}
        </Modal>
      )}
    </div>
  );
};
