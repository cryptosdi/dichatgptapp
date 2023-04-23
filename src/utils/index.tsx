export interface Chat {
  id: number;
  user_id: string;
  chat_name: string;
  chat_id:string
}

export interface Message {
  id: string;
  chatId: string;
  role: string;
  content: string;
  createdAt: Date;
}
