import { Chat } from '../types';

export const getLastMessage = (chat: Chat) => {
  if (chat.messages.length === 0) {
    return null;
  }
  return chat.messages[chat.messages.length - 1];
};
