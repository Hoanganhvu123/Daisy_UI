import { generateAIResponse } from './services/aiService';

async function testAIResponse() {
  const userInput = "Create a simple button with hover effect";
  try {
    const result = await generateAIResponse(userInput);
    console.log("Explanation:", result.explanation);
    console.log("Code:", result.code);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAIResponse();