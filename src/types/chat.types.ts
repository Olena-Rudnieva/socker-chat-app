export interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  messages: Message[];
}
