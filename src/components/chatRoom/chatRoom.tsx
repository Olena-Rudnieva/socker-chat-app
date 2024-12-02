import { Socket } from 'socket.io-client';
import styles from './chatRoom.module.css';
import { useEffect, useState } from 'react';

const username = 'John Doe';

interface ChatRoomProps {
  socket: Socket | null;
}

export const ChatRoom = ({ socket }: ChatRoomProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message.text]);
      });
    }
  }, [socket]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.image}>
          <img src="https://via.placeholder.com/40" alt="Avatar" />
        </div>
        <h3 className={styles.title}>{username}</h3>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};
