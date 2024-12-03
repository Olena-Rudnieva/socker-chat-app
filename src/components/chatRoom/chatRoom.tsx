import { Chat, User } from '../../types';
import styles from './chatRoom.module.css';
import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatDate } from '../../utils';
import { BASE_URL } from '../../constants/api';
// import { io, Socket } from 'socket.io-client';

interface ChatRoomProps {
  chat: Chat | null;
  user: User | null;
}

export const ChatRoom = ({ chat, user }: ChatRoomProps) => {
  // const [socket, setSocket] = useState<Socket | null>(null);

  const [messages, setMessages] = useState(chat?.messages || []);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  console.log('chat in ChatRoom', chat);
  console.log('messages', messages);

  useEffect(() => {
    if (chat && chat.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);

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
      const response = await axios.post(
        `${BASE_URL}/api/chats/${chat._id}/message`,
        newMessage
      );
      setMessages(response.data.messages);
      setMessage('');

      setTimeout(async () => {
        try {
          const chatWithAutoResponse = await axios.post(
            `${BASE_URL}/api/chats/auto-response`,
            {
              chatId: chat._id,
            }
          );

          setMessages(chatWithAutoResponse.data.messages);
        } catch (autoError) {
          console.error('Error in auto-response:', autoError);
        }
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
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
      <div className={styles.titleWrapper}>
        <div className={styles.image}>
          <img src="https://via.placeholder.com/40" alt="Avatar" />
        </div>
        <h3 className={styles.title}>
          {chat.firstName} {chat.lastName}
        </h3>
      </div>
      <div className={styles.blockWrapper}>
        <ul className={styles.messagesList}>
          {messages.map((msg, index) => {
            const isOwnMessage =
              msg.sender === `${user?.firstName} ${user?.lastName}`;
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
    </div>
  );
};
