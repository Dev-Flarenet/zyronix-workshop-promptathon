const LABELS = {
  clarity: 'Clarity',
  specificity: 'Specificity',
  creativity: 'Creativity',
  instructions: 'Instructions',
};

const COLORS = {
  clarity: 'from-emerald-500 to-emerald-400',
  specificity: 'from-blue-500 to-blue-400',
  creativity: 'from-purple-500 to-purple-400',
  instructions: 'from-orange-500 to-orange-400',
};

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="glass-card p-6 max-w-xl mx-auto animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-5">Score Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(breakdown || {}).map(([key, value]) => {
            const pct = Math.max(0, Math.min(10, Number(value) || 0)) * 10;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{LABELS[key] || key}</span>
                  <span className="text-sm font-bold text-white">{value}/10</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div
                    className={`bg-gradient-to-r ${COLORS[key] || 'from-gray-500 to-gray-400'} h-2.5 rounded-full transition-all duration-700 shadow-lg`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
