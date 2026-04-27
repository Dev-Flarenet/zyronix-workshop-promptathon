import { useState, useEffect, useRef } from 'react';
import { Timer, Send } from 'lucide-react';

export default function PromptInput({ participant, prompt, setPrompt, timeLeft, onSubmit }) {
  const [danger, setDanger] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 10) setDanger(true);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-800 font-medium">
          Hello, <span className="font-bold text-blue-700">{participant.name}</span>!
        </p>
        <div
          className={`flex items-center gap-1.5 font-mono font-bold text-lg ${
            danger ? 'text-red-600 animate-shake' : 'text-gray-700'
          }`}
        >
          <Timer className="w-5 h-5" />
          {formatted} remaining
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Your Prompt:
        </label>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Write your best AI prompt here..."
        />
        <p className="text-right text-xs text-gray-500 mt-1">
          Characters: {prompt.length}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-amber-600">
          Once submitted, you cannot edit your prompt.
        </p>
        <button
          onClick={onSubmit}
          disabled={!prompt.trim()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          Submit Prompt
        </button>
      </div>
    </div>
  );
}
