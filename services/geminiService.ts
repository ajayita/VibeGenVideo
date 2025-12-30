import { GoogleGenAI } from "@google/genai";
import { MASTER_PROMPT_TEMPLATE } from "../assets/hidden_prompt_template";

// Initialize the client. 
// Priority: Custom Key (from UI) -> Environment Variable
const getClient = (customApiKey?: string) => {
  const apiKey = customApiKey?.trim() || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a custom key in Settings or ensure the environment is configured.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateVideoPrompt = async (
  topic: string, 
  vibestack: string, 
  duration: string, 
  modelId: string,
  customApiKey?: string
): Promise<string> => {
  try {
    const ai = getClient(customApiKey);
    
    // Inject user inputs into the master template
    const finalSystemPrompt = MASTER_PROMPT_TEMPLATE
      .replace('{{TOPIC}}', topic)
      .replace('{{VIBESTACK}}', vibestack)
      .replace('{{DURATION}}', duration);

    // We allow the model to use its default thinking behavior.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: finalSystemPrompt,
      config: {
        temperature: 0.7, // Slightly creative but grounded
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text generated from the model.");
    }

    return text.trim();

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};