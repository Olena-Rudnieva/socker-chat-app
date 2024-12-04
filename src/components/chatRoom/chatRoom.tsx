import { Chat, User } from '../../types';
import styles from './chatRoom.module.css';
import { FaPaperPlane } from 'react-icons/fa';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatDate } from '../../utils';
import { Modal } from '../modal';
import { ModalConfirmDelete } from '../modalConfirmDelete';
import { ModalEditChat } from '../modalEditChat';
// import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL;

interface ChatRoomProps {
  chat: Chat | null;
  user: User | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export const ChatRoom = ({ chat, user, setChats }: ChatRoomProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState(chat?.messages || []);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  console.log('socket', socket);

  // useEffect(() => {
  //   if (chat && chat.messages) {
  //     setMessages(chat.messages);
  //   }
  // }, [chat]);

  useEffect(() => {
    if (user && chat) {
      const newSocket = io(BASE_URL);
      setSocket(newSocket);

      newSocket.emit('joinRoom', { chatId: chat._id });

      newSocket.on('message', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setChats((prevChats) =>
          prevChats.map((c) =>
            c._id === chat._id
              ? { ...c, messages: [...c.messages, newMessage] }
              : c
          )
        );
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [chat, user, setChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chat || !user) return;

    const newMessage = {
      chatId: chat._id,
      sender: `${user.firstName} ${user.lastName}`,
      message,
    };

    try {
      await axios.post(`${BASE_URL}/api/chats/${chat._id}/message`, newMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // const handleSendMessage = async () => {
  //   if (!message.trim() || !chat || !user) return;

  //   const newMessage = {
  //     chatId: chat._id,
  //     sender: `${user.firstName} ${user.lastName}`,
  //     message,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/api/chats/${chat._id}/message`,
  //       newMessage
  //     );

  //     const updatedMessages = response.data.messages;
  //     setMessages(updatedMessages);
  //     setMessage('');

  //     // setChats((prevChats) =>
  //     //   prevChats.map((c) =>
  //     //     c._id === chat._id ? { ...c, messages: updatedMessages } : c
  //     //   )
  //     // );

  //     setTimeout(async () => {
  //       try {
  //         const chatWithAutoResponse = await axios.post(
  //           `${BASE_URL}/api/chats/auto-response`,
  //           {
  //             chatId: chat._id,
  //           }
  //         );

  //         const autoUpdatedMessages = chatWithAutoResponse.data.messages;
  //         setMessages(autoUpdatedMessages);

  //         // setChats((prevChats) =>
  //         //   prevChats.map((c) =>
  //         //     c._id === chat._id ? { ...c, messages: autoUpdatedMessages } : c
  //         //   )
  //         // );

  //         toast.info('New message received!');
  //       } catch (autoError) {
  //         console.error('Error in auto-response:', autoError);
  //       }
  //     }, 3000);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };

  const toggleModal = (edit: boolean) => {
    setIsEdit(edit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteChat = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/chats/${chat?._id}`);
      if (response.status === 200) {
        console.log('Chat deleted successfully');
        setMessages([]);
        closeModal();
        setChats((prevChats) => prevChats.filter((c) => c._id !== chat?._id));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleUpdateChat = async (data: {
    firstName: string;
    lastName: string;
  }) => {
    if (chat) {
      try {
        console.log('updatedChat', data);
        const updatedChat = {
          ...data,
          userId: chat.userId,
        };

        const response = await axios.put(
          `${BASE_URL}/api/chats/${chat._id}`,
          updatedChat
        );
        if (response.status === 200) {
          console.log('Chat updated successfully');
          setChats((prevChats) =>
            prevChats.map((c) =>
              c._id === chat._id ? { ...c, ...updatedChat } : c
            )
          );
          closeModal();
        }
      } catch (error) {
        console.error('Error updating chat:', error);
      }
    }
  };

  // useEffect(() => {
  //   if (user && chat) {
  //     const newSocket = io('http://localhost:5001');
  //     setSocket(newSocket);

  //     const data = {
  //       chatId: chat._id,
  //       userId: user._id,
  //       userName: `${user.firstName} ${user.lastName}`,
  //     };

  //     newSocket.emit('joinRoom', data);

  //     newSocket.on('message', (message) => {
  //       setMessages((prevMessages) => [...prevMessages, message.text]);
  //     });

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }
  // }, [chat, user]);

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
