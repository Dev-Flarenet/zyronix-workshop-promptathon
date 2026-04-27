import { useState } from 'react';
import { User, Hash } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Who's Up Next?</h2>
      <p className="text-center text-gray-500 mb-8">Enter your details to begin your turn.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 21CS001"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !regNo.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Starting...' : 'Start My Turn'}
        </button>
      </form>
    </div>
  );
}
