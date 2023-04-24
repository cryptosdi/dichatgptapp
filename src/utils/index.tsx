export interface Chat {
  id: number;
  user_id: string;
  chat_name: string;
  chat_id: string
}

export interface Message {
  id: number;
  role: string;
  content: string;
  create_time: Date;
}
