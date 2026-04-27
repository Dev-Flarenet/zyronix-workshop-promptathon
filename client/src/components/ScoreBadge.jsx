import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function ScoreBadge({ score }) {
  const [display, setDisplay] = useState(0);
  const isHighScore = score >= 90;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1500;

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    if (isHighScore) {
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }, 500);
    }

    return () => cancelAnimationFrame(frame);
  }, [score, isHighScore]);

  return (
    <div className="text-center animate-slide-up">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Score</p>
      <div
        className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-4 shadow-2xl relative overflow-hidden ${
          isHighScore
            ? 'bg-yellow-500/10 border-yellow-400 text-yellow-400 shadow-yellow-500/20 neon-glow'
            : 'bg-indigo-500/10 border-indigo-400 text-indigo-400 shadow-indigo-500/20'
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isHighScore ? 'from-yellow-500/20 to-orange-500/10' : 'from-indigo-500/20 to-purple-500/10'
        }`} />
        <span className="relative z-10 text-5xl font-extrabold">{display}</span>
      </div>
      <p className="text-lg font-semibold text-gray-300 mt-2">/ 100</p>
      {isHighScore && <p className="text-yellow-400 font-bold mt-1 animate-pulse-glow">Amazing!</p>}
    </div>
  );
}
