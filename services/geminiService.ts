import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key must be provided in the environment variable API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Transcribes audio data using Gemini 2.5 Flash.
 * @param base64Audio The base64 encoded audio string.
 * @param mimeType The MIME type of the audio file.
 * @returns The transcribed text.
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    // Gemini 2.5 Flash is excellent for multimodal tasks including audio transcription.
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: `Please provide a highly accurate, verbatim transcription of this audio file. 
            
            Formatting rules:
            1. If there are multiple speakers, label them as "Speaker 1:", "Speaker 2:", etc., unless their names are mentioned.
            2. Use clear paragraph breaks for readability.
            3. Ignore filler words like "um", "uh" unless they are crucial for context.
            4. If the audio is from a video (like YouTube/Instagram), describe any crucial sound effects in brackets [Sound Effect].
            5. Return the output in Markdown format.`
          }
        ]
      },
      config: {
        // Higher budget not strictly needed for simple transcription, 
        // but flash allows for long context.
        temperature: 0.2, // Low temperature for higher accuracy/determinism
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No transcription generated.");
    }

    return text;

  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

/**
 * Helper to convert a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};