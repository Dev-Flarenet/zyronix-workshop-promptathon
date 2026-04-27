import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { ArrowRight, Users } from 'lucide-react';

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
      className="block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{session.title}</h3>
      {session.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{session.description}</p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{count} entries</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
          Open <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
