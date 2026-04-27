export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in Vercel environment' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    geminiApiKey: apiKey,
    geminiModel: model,
  });
}
