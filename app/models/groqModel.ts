import { ChatGroq } from "@langchain/groq";

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY as string,
  modelName: "mixtral-8x7b-32768",
  temperature: 0.7,
});

export default groqModel;