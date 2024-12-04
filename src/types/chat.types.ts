export interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  messages: Message[];
}
