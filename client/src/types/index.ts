export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  college?: string;
  location?: string;
  availability?: string;
  teachSkills: string[];
  learnSkills: string[];
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; website?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionRequest {
  _id: string;
  sender: User | string;
  receiver: User | string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  actor?: string;
  type: 'connection_request' | 'connection_accepted' | 'new_message' | 'missed_call';
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
