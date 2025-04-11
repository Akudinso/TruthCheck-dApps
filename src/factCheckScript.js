import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyD0GCYsN8JkzJR_JrFhufdlK1BFN9kibz4" });

const instruction = `
You are a fact-checking expert. I will give you a piece of text that may contain one or more factual claims.
For each claim, label it with one of the following:
  - "True"
  - "False"
  - "Unverifiable"

Always choose one of the above. If a statement is opinion, rhetorical, unverifiable due to lack of information, or partially true without full context, label it as "Unverifiable". Provide a short explanation only when the label is "False" or "Unverifiable".

Return the result as raw JSON. Do not include any markdown formatting, code blocks, or extra commentary. Only output a JSON array of objects, each with:
  - claim: string
  - label: "True" | "False" | "Unverifiable"
  - explanation: (optional) string
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
        temperature: 0
      }
    });

    const raw = response.text.trim();
    const jsonStart = raw.indexOf("[");
    const json = JSON.parse(raw.slice(jsonStart));
    return json;

  } catch (err) {
    console.error("Fact-checking error:", err);
    throw new Error("Failed to parse fact-check response");
  }
}
