import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

function parseEvaluation(rawText) {
  const cleanText = String(rawText || '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleanText);

  return {
    totalScore: Number(parsed.totalScore) || 0,
    remarks: parsed.remarks || '',
    breakdown: {
      clarity: Number(parsed.breakdown?.clarity) || 0,
      specificity: Number(parsed.breakdown?.specificity) || 0,
      creativity: Number(parsed.breakdown?.creativity) || 0,
      instructions: Number(parsed.breakdown?.instructions) || 0,
    },
  };
}

export async function evaluatePromptWithGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing VITE_GEMINI_API_KEY in client environment');
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const systemPrompt = `You are an expert AI Prompt Evaluator for a school AI workshop.

Evaluate the following student prompt on a scale of 0-100.

STUDENT PROMPT:
"${prompt}"

Return ONLY a valid JSON object with no extra text:
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

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: systemPrompt,
  });

  return parseEvaluation(response.text);
}
