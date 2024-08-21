import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
  modelName: "gemini-pro",
  temperature: 0.7,
});

export default geminiModel;