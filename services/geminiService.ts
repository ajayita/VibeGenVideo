import { GoogleGenAI } from "@google/genai";
import { MASTER_PROMPT_TEMPLATE } from "../assets/hidden_prompt_template";

// Initialize the client. API_KEY is expected to be in the environment.
// Using a factory pattern or direct check to ensure key exists before call.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVideoPrompt = async (topic: string, vibestack: string, duration: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Inject user inputs into the master template
    const finalSystemPrompt = MASTER_PROMPT_TEMPLATE
      .replace('{{TOPIC}}', topic)
      .replace('{{VIBESTACK}}', vibestack)
      .replace('{{DURATION}}', duration);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: finalSystemPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster generation
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