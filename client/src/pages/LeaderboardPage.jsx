import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Navbar from '../components/Navbar.jsx';
import { Trophy, Medal, Circle, ArrowLeft, Clock } from 'lucide-react';

const RANK_ICONS = [
  <Medal key={1} className="w-6 h-6 text-yellow-400" />,
  <Medal key={2} className="w-6 h-6 text-gray-400" />,
  <Medal key={3} className="w-6 h-6 text-amber-600" />,
];

export default function LeaderboardPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getDoc(doc(db, 'sessions', sessionId)).then((snap) => {
      if (snap.exists()) setSession(snap.data());
    });
  }, [sessionId]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'sessions', sessionId, 'participants'), (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((entry) => entry.promptSubmitted);

      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.timeTaken || 9999) - (b.timeTaken || 9999);
      });

      setEntries(list);
    });
    return () => unsub();
  }, [sessionId]);

  const formatTime = (s) => {
    if (!s && s !== 0) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6 animate-slide-up">
          <button
            onClick={() => navigate(`/session/${sessionId}`)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Session
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h1 className="text-xl font-bold gradient-text truncate max-w-xs sm:max-w-md">
              {session?.title || 'Leaderboard'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
            <Circle className="w-2.5 h-2.5 fill-emerald-400 animate-pulse" />
            LIVE
          </div>
        </div>

        <div className="glass-card overflow-hidden animate-slide-up">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 w-16">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden sm:table-cell">Reg No</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No entries yet. Waiting for participants...
                  </td>
                </tr>
              )}
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-white/10 transition hover:bg-white/5 ${
                      isTop3 ? 'bg-yellow-500/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {RANK_ICONS[rank - 1] || (
                          <span className="w-6 h-6 inline-flex items-center justify-center text-xs font-bold text-gray-400">
                            {rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-400">{entry.regNo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded ${
                          isTop3 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/10 text-gray-300 border border-white/20'
                        }`}
                      >
                        {entry.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(entry.timeTaken)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {entries.length} participant{entries.length !== 1 ? 's' : ''} so far
        </p>
      </main>
    </div>
  );
}
