// pages/index.tsx
'use client'

import React, { useState } from 'react';
import WebPreview from './components/WebPreview';
import ChatBot from './components/ChatBot';
import { useChatBot } from './hooks/useChatBot';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string | null>();
  const { sendMessage, chatHistory, addMessage } = useChatBot();

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
  };

  const handleElementSelect = async (elementInfo: { tag: string; id: string; className: string }, editRequest: string) => {
    const response = await sendMessage(editRequest);
    if (response.code) {
      setGeneratedCode(response.code);
    }
  };

  const handleSendMessage = (message: string) => {
    addMessage({ role: 'user', content: message });
    sendMessage(message);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-[30%] border-r border-gray-200 overflow-hidden">
        <ChatBot 
          onCodeGenerated={handleCodeGenerated}
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
        />
      </div>
      <div className="w-[1%]"></div>
      <div className="w-[69%] h-full overflow-hidden">
        <WebPreview
          code={generatedCode}
          onElementSelect={handleElementSelect}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}