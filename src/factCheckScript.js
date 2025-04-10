import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyD0GCYsN8JkzJR_JrFhufdlK1BFN9kibz4" });

const instruction = `You are a fact-checking expert. I will provide you with a text, and your task is to verify the facts in the text. 
For each claim, respond with a simple answer: 'True' if the claim is correct, or 'Not True' if the claim is false or misleading. 
Provide a brief explanation only if necessary, but prioritize brevity and clarity.`;

export async function factCheckText(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      systemInstruction: {
        parts: [{ text: instruction }]
      }
    }
  });
  return response.text;
}

