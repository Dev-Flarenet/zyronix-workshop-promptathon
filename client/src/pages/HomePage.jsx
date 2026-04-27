import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Navbar from '../components/Navbar.jsx';
import SessionCard from '../components/SessionCard.jsx';
import CreateSessionModal from '../components/CreateSessionModal.jsx';
import { Plus, Rocket } from 'lucide-react';

export default function HomePage() {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(list);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">Sessions</h1>
            <p className="text-gray-400 text-sm">Manage your prompt evaluation sessions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Session
          </button>
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-20 animate-slide-up">
            <div className="glass-card max-w-md mx-auto p-8">
              <Rocket className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse-glow" />
              <p className="text-gray-300 text-lg mb-2">No sessions yet.</p>
              <p className="text-gray-500">Click "New Session" to create your first prompt evaluation session.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
            <div key={session.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <SessionCard session={session} />
            </div>
          ))}
        </div>
      </main>

      {showModal && <CreateSessionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
