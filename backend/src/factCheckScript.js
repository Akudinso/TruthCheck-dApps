import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Google API key is missing in the environment variables");
}

const ai = new GoogleGenAI({ apiKey });

const instruction = `
You are a fact-checking expert. I will give you a piece of text to evaluate as a whole.
Respond ONLY with valid JSON in this exact format (no extra text, no markdown, no code blocks):

{
  "claim": "[the entire input text]",
  "label": "True" | "False" | "Unverifiable",
  "explanation": "[only if label is False or Unverifiable]"
}

Rules:
1. Evaluate the entire text as one claim
2. "True" only for verifiably true factual statements
3. "False" for verifiably false statements (with explanation)
4. "Unverifiable" for opinions, predictions, or incomplete information (with explanation)
5. No additional commentary outside the JSON structure
`;

export async function factCheckText(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: content }] }],
      config: {
        systemInstruction: {
          parts: [{ text: instruction }]
        },
        temperature: 0,
        response_mime_type: "application/json"
      }
    });

    try {
      const result = JSON.parse(response.text);
      return result;
    } catch (parseError) {
      const jsonMatch = response.text.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not extract JSON from response");
    }

  } catch (err) {
    console.error("Fact-checking error:", err);
    throw new Error("Failed to process fact-check response");
  }
}