export interface Chat {
    id: string;
    description: string;
    createdAt: Date;
  }
  
  export interface Message {
    id: string;
    chatId: string;
    role: "system" | "assistant" | "user";
    content: string;
    createdAt: Date;
  }
  
  export interface Prompt {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }