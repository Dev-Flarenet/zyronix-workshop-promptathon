import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { ArrowRight, Users, Zap } from 'lucide-react';

export default function SessionCard({ session }) {
  const [count, setCount] = useState(session.participantCount || 0);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sessions', session.id, 'participants'),
      (snap) => setCount(snap.size)
    );
    return () => unsub();
  }, [session.id]);

  const isActive = session.isActive !== false;

  return (
    <Link
      to={`/session/${session.id}`}
      className="glass-card-hover block p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            {isActive ? 'Active' : 'Closed'}
          </span>
          {isActive && <Zap className="w-4 h-4 text-yellow-400 animate-pulse-glow" />}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {session.title}
        </h3>
        {session.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{session.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>{count} {count === 1 ? 'entry' : 'entries'}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
