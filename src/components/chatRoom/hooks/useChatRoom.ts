import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { Chat, Message, User } from '../../../types';

const BASE_URL = import.meta.env.VITE_API_URL;

interface UseChatRoomLogicProps {
  chat: Chat | null;
  user: User | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export const useChatRoom = ({
  chat,
  user,
  setChats,
}: UseChatRoomLogicProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>(chat?.messages || []);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chat && chat.messages) setMessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user && chat) {
      const newSocket: Socket = io(BASE_URL);
      setSocket(newSocket);
      newSocket.emit('joinRoom', { chatId: chat._id });

      newSocket.on('message', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [chat, user]);

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
          const autoResponse = await axios.post(
            `${BASE_URL}/api/chats/auto-response`,
            { chatId: chat._id }
          );
          setMessages(autoResponse.data.messages);
          toast.info('New message received!');
        } catch (error) {
          console.error('Error in auto-response:', error);
        }
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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
    if (!chat) return;

    try {
      const updatedChat = { ...data, userId: chat.userId };
      const response = await axios.put(
        `${BASE_URL}/api/chats/${chat._id}`,
        updatedChat
      );
      if (response.status === 200) {
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
  };

  return {
    socket,
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
  };
};
