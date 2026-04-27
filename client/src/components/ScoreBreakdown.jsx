const LABELS = {
  clarity: 'Clarity',
  specificity: 'Specificity',
  creativity: 'Creativity',
  instructions: 'Instructions',
};

const COLORS = {
  clarity: 'bg-emerald-500',
  specificity: 'bg-blue-500',
  creativity: 'bg-purple-500',
  instructions: 'bg-orange-500',
};

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Score Breakdown</h3>
      <div className="space-y-4">
        {Object.entries(breakdown || {}).map(([key, value]) => {
          const pct = Math.max(0, Math.min(10, Number(value) || 0)) * 10;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{LABELS[key] || key}</span>
                <span className="text-sm font-bold text-gray-900">{value}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${COLORS[key] || 'bg-gray-500'} h-2.5 rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
