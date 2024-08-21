export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type SendMessageInput = {
  type: string;
  content: string;
};
