import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, User, Bot } from 'lucide-react';
import { useChatBot } from '../hooks/useChatBot';

interface ChatBotProps {
  onCodeGenerated: (code: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onCodeGenerated }) => {
  const { chatHistory, isTyping, sendMessage } = useChatBot();
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const { response, code } = await sendMessage(inputMessage.trim());
      setInputMessage('');
      if (code) {
        onCodeGenerated(code);
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const renderMessage = (message: typeof chatHistory[number], index: number) => {
    const isBot = message.role === 'assistant';
    const content = message.content;

    return (
      <div key={index} className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mr-2">
            {isBot ? <Bot className="w-5 h-5 text-black" /> : <User className="w-5 h-5 text-black" />}
          </div>
          <p className="font-semibold text-black">{isBot ? 'AI Designer' : 'You'}</p>
        </div>
        <p className="text-gray-800">{content}</p>

        <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Chat with AI</h2>
      </div>

      
      <div className="flex-1 overflow-y-auto p-6" ref={chatContainerRef}>
        {chatHistory.map((message, index) => renderMessage(message, index))}
        {isTyping && (
          <div className="flex items-center mt-4">
            <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mr-2">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <span className="text-gray-800">AI is thinking...</span>
            <Loader className="w-4 h-4 ml-2 text-black animate-spin" />
          </div>
        )}
      </div>


      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;