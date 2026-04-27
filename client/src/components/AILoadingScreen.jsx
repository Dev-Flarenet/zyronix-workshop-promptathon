import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

export default function AILoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Gemini is reading your prompt...');

  useEffect(() => {
    const messages = [
      'Gemini is reading your prompt...',
      'Analyzing clarity and structure...',
      'Scoring creativity and specificity...',
      'Generating personalized feedback...',
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next > 25 && next < 50 && msgIdx === 0) { setMessage(messages[1]); msgIdx = 1; }
        if (next > 50 && next < 75 && msgIdx === 1) { setMessage(messages[2]); msgIdx = 2; }
        if (next > 75 && msgIdx === 2) { setMessage(messages[3]); msgIdx = 3; }
        return Math.min(next, 95);
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-10 max-w-xl mx-auto text-center animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-6 neon-glow">
          <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{message}</h3>

        <div className="w-full bg-white/10 rounded-full h-3 mt-6 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 font-medium">{progress}%</p>
      </div>
    </div>
  );
}
