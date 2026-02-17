import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateStudyResponse = async (
  prompt: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const model = MODEL_NAME;
    
    // Construct content parts
    const parts: any[] = [];
    
    if (imageBase64) {
      // Extract the base64 data and mime type
      // Expecting format: "data:image/png;base64,..."
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    if (prompt) {
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but focused
      },
    });

    return response.text || "I couldn't generate a text response. Please try again.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Something went wrong while contacting StudyAI.");
  }
};
