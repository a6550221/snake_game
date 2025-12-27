
import { GoogleGenAI } from "@google/genai";
import { ImageGenConfig } from "../types";

export const generateVictoryCard = async (score: number, config: ImageGenConfig): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Create a high-quality retro-futuristic synthwave neon victory greeting card for a player who just achieved a high score of ${score} in a cyber-snake game. 
    The style should be dark neon, featuring glowing pink and cyan grids, a stylized digital snake, and the text "SNAKE MASTER - SCORE: ${score}" prominently displayed in a 1980s retro font. 
    High contrast, vibrant purple, pink and teal colors. Cyberpunk aesthetic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      },
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if environment doesn't support the helper
};

export const openApiKeySelector = async () => {
  if (typeof window.aistudio?.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
  }
};
