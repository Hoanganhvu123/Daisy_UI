import { ChatOpenAI } from "@langchain/openai";

const openaiModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

export default openaiModel;