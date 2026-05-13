import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const safeJsonParse = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    return {};
  }
};

export const conversationalTriage = async (history: any[], audioBase64: string, mimeType: string, language: 'en' | 'hi') => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      {
        role: "user",
        parts: [
          { inlineData: { data: audioBase64, mimeType } },
          { text: `Listen to my symptoms. You MUST reply ONLY in ${language === 'hi' ? 'Hindi' : 'English'}. Be empathetic and ask follow-up questions if needed to understand the severity. If you detect an emergency, tell me immediately. Keep your response concise as it will be read aloud. Return your response as a simple text string, not JSON.` }
        ]
      }
    ],
    config: {
      systemInstruction: `You are a helpful medical triage assistant for rural patients. You are currently speaking in ${language === 'hi' ? 'Hindi' : 'English'}. Your goal is to understand the patient's symptoms through conversation and provide guidance. Always prioritize safety and identify danger signs. Keep responses short and clear.`
    }
  });
  
  return response.text;
};
export const analyzeSymptoms = async (audioBase64: string, mimeType: string = "audio/webm", language: 'en' | 'hi') => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: audioBase64, mimeType } },
          { text: `Listen to the symptoms and provide a medical triage. You MUST provide the 'summary' and 'advice' strictly in ${language === 'hi' ? 'Hindi' : 'English'}. Identify danger signs (high fever, breathlessness). If danger signs exist, explicitly state 'EMERGENCY ALERT'. Return as JSON with fields: 'summary', 'dangerSigns', 'advice', 'emergency'.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          dangerSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
          emergency: { type: Type.BOOLEAN }
        },
        required: ["summary", "dangerSigns", "advice", "emergency"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const analyzeNutrition = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "Analyze this child's photo for signs of malnutrition (wasting, stunting, edema). Provide a risk level (Normal, Mild, High) and simple nutritional advice for parents in Hindi and English. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING },
          observations: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.STRING },
          hindiAdvice: { type: Type.STRING }
        },
        required: ["riskLevel", "observations", "recommendations", "hindiAdvice"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const analyzeMedicine = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "OCR this medicine strip/bottle. Identify the medicine name, its use, dosage, and safety warnings. Explain in simple Hindi and English. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicineName: { type: Type.STRING },
          purpose: { type: Type.STRING },
          dosage: { type: Type.STRING },
          warnings: { type: Type.STRING },
          hindiExplanation: { type: Type.STRING }
        },
        required: ["medicineName", "purpose", "dosage", "warnings", "hindiExplanation"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const analyzePrescription = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "OCR this doctor's prescription. Extract medicine names, dosages (like 1-0-1), and timings. Explain clearly in simple Hindi and English. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                timing: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING },
          hindiSummary: { type: Type.STRING }
        },
        required: ["medicines", "summary", "hindiSummary"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const jargonBuster = async (term: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the medical term "${term}" in very simple, 6th-standard level language for a rural patient. Provide the explanation in both English and Hindi. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          explanation: { type: Type.STRING },
          hindiExplanation: { type: Type.STRING }
        },
        required: ["term", "explanation", "hindiExplanation"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const analyzeLabReport = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "OCR this lab report. Identify any abnormal values (outside reference range). Explain what these values mean in very simple, plain language for a rural patient. Provide advice in Hindi and English. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reportType: { type: Type.STRING },
          abnormalValues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                parameter: { type: Type.STRING },
                value: { type: Type.STRING },
                referenceRange: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING },
          hindiSummary: { type: Type.STRING }
        },
        required: ["reportType", "abnormalValues", "summary", "hindiSummary"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const analyzeVisualSymptoms = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "Analyze this photo of a skin rash, eye issue, or swelling. Identify potential causes and provide simple advice. Explicitly state that this is not a diagnosis. Provide advice in Hindi and English. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          potentialCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
          hindiAdvice: { type: Type.STRING },
          urgency: { type: Type.STRING, description: "Low, Medium, High" }
        },
        required: ["potentialCauses", "advice", "hindiAdvice", "urgency"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const mentalWellnessVoiceChat = async (history: any[], audioBase64: string, mimeType: string, language: 'en' | 'hi') => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      {
        role: "user",
        parts: [
          { inlineData: { data: audioBase64, mimeType } },
          { text: `I'm sharing how I feel via audio. Please listen and respond empathetically as my digital therapist. CRITICAL: You MUST reply ONLY in ${language === 'hi' ? 'Hindi' : 'English'}. Keep your response concise and comforting as it will be read aloud.` }
        ]
      }
    ],
    config: {
      systemInstruction: `You are Hamdard's Digital Therapist, an empathetic, supportive, and calm companion for mental wellness. You are currently speaking in ${language === 'hi' ? 'Hindi' : 'English'}. You MUST always respond ONLY in ${language === 'hi' ? 'Hindi' : 'English'}. Use simple, relatable language. If the user expresses self-harm or severe crisis, provide emergency hotline numbers (102/108) and advise professional help immediately. Keep responses concise and comforting.`,
    }
  });
  
  return response.text;
};

export const mentalWellnessChat = async (history: any[], message: string, language: 'en' | 'hi') => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are Hamdard's Digital Therapist, an empathetic, supportive, and calm companion for mental wellness. You MUST always respond ONLY in ${language === 'hi' ? 'Hindi' : 'English'}. Use simple, relatable language. If the user expresses self-harm or severe crisis, provide emergency hotline numbers (102/108) and advise professional help immediately. Keep responses concise and comforting.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getPeriodTips = async (dayInCycle: number, cycleLength: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user is on day ${dayInCycle} of a ${cycleLength}-day menstrual cycle. Provide phase-specific health tips, ovulation prediction, and wellness advice in simple Hindi and English. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          ovulationStatus: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          hindiTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["phase", "ovulationStatus", "tips", "hindiTips"]
      }
    }
  });
  return safeJsonParse(response.text || "{}");
};

export const findHospitals = async (location: string, lat?: number, lng?: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find nearby PHCs, CHCs, and district hospitals near ${location}. Provide names, distances, and contact info if available.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
        }
      }
    }
  });
  
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const textToSpeech = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
