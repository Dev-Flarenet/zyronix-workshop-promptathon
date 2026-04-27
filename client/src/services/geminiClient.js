import { GoogleGenAI } from '@google/genai';

const LOCAL_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const LOCAL_GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

let runtimeConfigPromise;

async function getRuntimeConfig() {
  if (LOCAL_GEMINI_API_KEY) {
    return {
      geminiApiKey: LOCAL_GEMINI_API_KEY,
      geminiModel: LOCAL_GEMINI_MODEL,
    };
  }

  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch('/api/runtime-config', {
      headers: { Accept: 'application/json' },
    }).then(async (response) => {
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load Gemini runtime config');
      }

      if (!payload.geminiApiKey) {
        throw new Error('Missing GEMINI_API_KEY in Vercel environment');
      }

      return payload;
    });
  }

  return runtimeConfigPromise;
}

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
  const { geminiApiKey, geminiModel } = await getRuntimeConfig();

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

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
    model: geminiModel,
    contents: systemPrompt,
  });

  return parseEvaluation(response.text);
}
