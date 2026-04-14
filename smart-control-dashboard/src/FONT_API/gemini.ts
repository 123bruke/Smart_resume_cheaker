import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Chatbot features will be disabled.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const analyzeResume = async (resumeText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze this resume and provide a score out of 100, strengths, weaknesses, and suggestions for improvement. Format the response as JSON with keys: score, strengths (array), weaknesses (array), suggestions (array). Resume text: ${resumeText}` }]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
