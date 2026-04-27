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
    <div className="text-center">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Score</p>
      <div
        className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-4 shadow-lg ${
          isHighScore
            ? 'bg-yellow-50 border-yellow-400 text-yellow-700 shadow-yellow-200'
            : 'bg-blue-50 border-blue-400 text-blue-700 shadow-blue-200'
        }`}
      >
        <span className="text-5xl font-extrabold">{display}</span>
      </div>
      <p className="text-lg font-semibold text-gray-700 mt-2">/ 100</p>
      {isHighScore && <p className="text-yellow-600 font-bold mt-1">Amazing!</p>}
    </div>
  );
}
