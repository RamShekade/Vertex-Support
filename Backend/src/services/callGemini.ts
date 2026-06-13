
import { GoogleGenAI } from "@google/genai/node";
import { AIMessage } from "../models/message";

const SYSTEM_PROMPT = "You are a helpful assistant that provides concise and accurate answers to user queries. Always respond in a clear and informative manner, ensuring that your answers are relevant to the user's question. If you don't know the answer, it's okay to say you don't know, but try to provide any related information that might be helpful.";

export async function callGemini(message: string, history: AIMessage[]): Promise<string> {

  const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
  });


  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history.map((msg) => ({
            role: msg.sender,
            parts: [{ text: msg.text }],
          })),
          {
            role: "user",
            parts: [{ text: message }],
          },
      ],
    });
    

    return response.candidates ? [0].content?.parts[0]?.text || "" : "";
  } catch (error) {

        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from Gemini API");
    }
}