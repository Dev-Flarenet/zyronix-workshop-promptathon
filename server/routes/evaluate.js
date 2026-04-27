import { Router } from 'express';
import { evaluatePrompt } from '../services/geminiService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await evaluatePrompt(prompt);
    res.json(result);
  } catch (err) {
    console.error('Evaluate error:', err.message);
    res.status(500).json({ error: err.message || 'Evaluation failed' });
  }
});

export default router;
