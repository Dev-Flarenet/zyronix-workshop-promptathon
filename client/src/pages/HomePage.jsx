import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Navbar from '../components/Navbar.jsx';
import SessionCard from '../components/SessionCard.jsx';
import CreateSessionModal from '../components/CreateSessionModal.jsx';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sessions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            + New Session
          </button>
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No sessions yet.</p>
            <p className="text-gray-400">Click "+ New Session" to create one.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </main>

      {showModal && <CreateSessionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
