import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MedicalTermResponse } from "../types";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    englishTerm: { 
      type: Type.STRING,
      description: "The corrected English medical term (e.g., Hyperglycemia)." 
    },
    parts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: ["prefix", "root", "suffix", "combining_vowel", "combining_form", "other"],
            description: "The morphological category of this part."
          },
          meaning: { type: Type.STRING, description: "Meaning of this specific part in Arabic." }
        },
        required: ["text", "type", "meaning"]
      }
    },
    arabicTranslation: { type: Type.STRING, description: "Accurate medical Arabic translation." },
    translationNote: { type: Type.STRING, description: "Note on common vs academic usage." },
    academicExplanation: {
      type: Type.OBJECT,
      properties: {
        definition: { type: Type.STRING, description: "Academic medical definition in Arabic." },
        pathophysiology: { type: Type.STRING, description: "Brief pathophysiology in Arabic." },
        clinicalContext: { type: Type.STRING, description: "When is this term used clinically?" }
      },
      required: ["definition", "pathophysiology", "clinicalContext"]
    },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING, description: "English sentence." },
          translation: { type: Type.STRING, description: "Arabic translation of the sentence." },
          context: { type: Type.STRING, description: "Context (e.g., Diagnosis, Lab Report)." }
        },
        required: ["sentence", "translation", "context"]
      }
    }
  },
  required: ["englishTerm", "parts", "arabicTranslation", "academicExplanation", "examples"]
};

const SYSTEM_INSTRUCTION = `
You are Dr. Aboudy, a specialized Medical Terminology AI. 
Your task is to analyze medical terms provided in English or Arabic transliteration (e.g., "هايبرجلايسميا").
1. Recognize the term and convert to English if necessary.
2. Break it down morphologically (Prefix, Root, Suffix).
3. Provide an accurate Arabic medical translation.
4. Provide an academic explanation suitable for medical students (in Arabic).
5. Provide clinical usage examples.
Always output valid JSON. Use 'Tajawal' style Arabic (formal, medical).
`;

export const analyzeMedicalTerm = async (input: string): Promise<MedicalTermResponse> => {
  try {
    // Initialize AI client here to avoid issues with process.env during module load
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this medical term: "${input}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MedicalTermResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};