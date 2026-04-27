import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in server environment');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function evaluatePrompt(prompt) {
  const systemPrompt = `You are an expert AI Prompt Evaluator for a school AI workshop.

Evaluate the following student prompt on a scale of 0-100.

STUDENT PROMPT:
"${prompt}"

Return ONLY a valid JSON object — no extra text, no markdown, no code fences:
{
  "totalScore": 78,
  "remarks": "2-3 sentences of encouraging, constructive feedback.",
  "breakdown": {
    "clarity": 8,
    "specificity": 6,
    "creativity": 9,
    "instructions": 7
  }
}

Scoring Criteria (each out of 10, x2.5 = 25pts each):
- Clarity: Is the prompt easy to understand?
- Specificity: Does it give clear context and constraints?
- Creativity: Is it original and imaginative?
- Instructions: Does it guide AI with format/tone/persona?

Be warm and encouraging. These are school students writing prompts for the first time.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: systemPrompt,
    });

    const rawText = response.text || '';

    // Clean up possible markdown fences
    const cleanText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Gemini API error:', e.message);
    throw new Error(`Gemini evaluation failed: ${e.message}`);
  }
}
