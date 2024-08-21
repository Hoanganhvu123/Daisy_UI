// // hooks/useChatBot.ts

// import { useState, useCallback } from 'react';
// import { generateAIResponse } from '../services/aiService';

// export type ChatMessage = {
//   role: 'user' | 'assistant';
//   content: string;
//   code?: string | null;
// };

// export const useChatBot = () => {
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
//   const [isTyping, setIsTyping] = useState(false);

//   const sendMessage = useCallback(async (message: string) => {
//     setIsTyping(true);

//     setChatHistory(prev => [...prev, { role: 'user', content: message }]);

//     try {
//       const aiResponse = await generateAIResponse(message);

//       const aiResponseString = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);

//       // Extract the code from within <artifact> tags
//       const artifactMatch = aiResponseString.match(/<artifact>([\s\S]*?)<\/artifact>/);

//       // Process code from artifact
//       const code = artifactMatch ? artifactMatch[1].trim() : null;
      
//       // Extract the explanation (everything before <artifact> tag)
//       const response = aiResponseString.split('<artifact>')[0].trim();

//       // Add AI response to chat history with separated content and code
//       setChatHistory(prev => [...prev, { 
//         role: 'assistant', 
//         content: response, 
//         code: code 
//       }]);

//       return { response, code };
//     } catch (error) {
//       console.error('Error getting AI response:', error);
//       setChatHistory(prev => [
//         ...prev,
//         {
//           role: 'assistant',
//           content: 'Sorry, I encountered an error. Please try again.',
//           code: null
//         },
//       ]);
//       return { response: 'Error occurred', code: null };
//     } finally {
//       setIsTyping(false);
//     }
//   }, []);

//   return {
//     chatHistory,
//     isTyping,
//     sendMessage,
//   };
// };

// hooks/useChatBot.ts

import { useState, useCallback } from 'react';
import { generateAIResponse } from '../services/aiService';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  code?: string | null;
};

export const useChatBot = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    setIsTyping(true);

    setChatHistory(prev => [...prev, { role: 'user', content: message }]);

    try {
      const aiResponse = await generateAIResponse(message);

      const aiResponseString = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);

      const artifactMatch = aiResponseString.match(/<artifact>([\s\S]*?)<\/artifact>/);

      const code = artifactMatch ? artifactMatch[1].trim() : null;
      
      const response = aiResponseString.split('<artifact>')[0].trim();

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        code: code
      }]);

      return { response, code };
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          code: null
        },
      ]);
      return { response: 'Error occurred', code: null };
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    chatHistory,
    isTyping,
    sendMessage,
  };
};