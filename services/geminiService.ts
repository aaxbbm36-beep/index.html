import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedTrack } from "../types";

const createClient = () => {
  // Safety check: Ensure process is defined before accessing process.env
  // This prevents "ReferenceError: process is not defined" in some browser environments
  let apiKey = '';
  try {
    // Use a safer check that doesn't trigger ReferenceError on 'process' access
    const globalProcess = (typeof process !== 'undefined') ? process : undefined;
    if (globalProcess && globalProcess.env) {
      apiKey = globalProcess.env.API_KEY || '';
    }
  } catch (e) {
    console.warn('Environment variable access failed:', e);
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateSongConcept = async (prompt: string): Promise<GeneratedTrack> => {
  const ai = createClient();
  
  const systemInstruction = `
    Bạn là một nhạc sĩ và nhà sản xuất âm nhạc chuyên nghiệp.
    Hãy tạo ra một cấu trúc bài hát dựa trên yêu cầu của người dùng.
    Ngôn ngữ: Tiếng Việt.
    Đầu ra phải ở định dạng JSON với các trường: "title" (tên bài hát), "lyrics" (lời bài hát, ít nhất 2 khổ), "description" (mô tả ngắn về giai điệu và nhạc cụ), "mood" (tâm trạng).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as GeneratedTrack;
  } catch (error) {
    console.error("Error generating song concept:", error);
    throw new Error("Không thể tạo bài hát lúc này.");
  }
};

export const generateAudioPreview = async (textToSpeak: string): Promise<string> => {
  const ai = createClient();
  
  // Using TTS model as a proxy for "singing" or reading the lyrics in a music app demo
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: textToSpeak }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Selecting a voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    return `data:audio/mp3;base64,${base64Audio}`;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};