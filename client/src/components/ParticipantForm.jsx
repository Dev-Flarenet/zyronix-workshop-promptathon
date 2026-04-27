import { useState } from 'react';
import { User, Hash, Sparkles } from 'lucide-react';

export default function ParticipantForm({ onStart }) {
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !regNo.trim()) return;
    setLoading(true);
    await onStart(name.trim(), regNo.trim());
    setLoading(false);
  };

  return (
    <div className="glass-card p-8 max-w-lg mx-auto animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold gradient-text">Who's Up Next?</h2>
          </div>
          <p className="text-gray-400">Enter your details to begin your turn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-12"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Registration Number</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="input-field pl-12"
                placeholder="e.g., 21CS001"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim() || !regNo.trim()}
            className="btn-primary w-full"
          >
            {loading ? 'Starting...' : 'Start My Turn'}
          </button>
        </form>
      </div>
    </div>
  );
}
