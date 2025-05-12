export interface Message {
    id: string;
    chatSessionId: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }

  export interface ChatSession {
    id: string;
    title: string;
    timestamp: Date;
    messages: Message[];
  }

  export interface Location {
    lat: number;
    lng: number;
    name: string;
  }
