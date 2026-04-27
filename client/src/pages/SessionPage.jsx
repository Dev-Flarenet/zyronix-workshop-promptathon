import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { evaluatePromptWithGemini } from '../services/geminiClient.js';
import Navbar from '../components/Navbar.jsx';
import ParticipantForm from '../components/ParticipantForm.jsx';
import PromptInput from '../components/PromptInput.jsx';
import AILoadingScreen from '../components/AILoadingScreen.jsx';
import ScoreBadge from '../components/ScoreBadge.jsx';
import ScoreBreakdown from '../components/ScoreBreakdown.jsx';
import RemarksCard from '../components/RemarksCard.jsx';

const MODES = { FORM: 'form', PROMPT: 'prompt', LOADING: 'loading', RESULT: 'result' };
const TIMER_SECONDS = 90;

export default function SessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState(MODES.FORM);
  const [participant, setParticipant] = useState({ name: '', regNo: '', id: '' });
  const [prompt, setPrompt] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    getDoc(doc(db, 'sessions', sessionId)).then((snap) => {
      if (snap.exists()) setSession(snap.data());
    });
  }, [sessionId]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleStart = async (name, regNo) => {
    try {
      const ref = await addDoc(collection(db, 'sessions', sessionId, 'participants'), {
        name,
        regNo,
        joinedAt: serverTimestamp(),
        promptSubmitted: false,
      });
      setParticipant({ name, regNo, id: ref.id });
      setMode(MODES.PROMPT);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Failed to start turn. Please try again.');
    }
  };

  useEffect(() => {
    if (mode === MODES.PROMPT && timeLeft <= 0) {
      handleSubmitPrompt();
    }
  }, [timeLeft, mode]);

  const handleSubmitPrompt = async () => {
    clearTimer();
    const finalPrompt = prompt.trim() || '';
    if (!finalPrompt) {
      setError('Please enter a prompt before submitting.');
      setMode(MODES.PROMPT);
      return;
    }
    setError('');
    setMode(MODES.LOADING);

    const timeTaken = Math.min(
      TIMER_SECONDS,
      Math.floor((Date.now() - startTimeRef.current) / 1000)
    );

    try {
      const data = await evaluatePromptWithGemini(finalPrompt);

      await updateDoc(doc(db, 'sessions', sessionId, 'participants', participant.id), {
        prompt: finalPrompt,
        score: data.totalScore ?? 0,
        remarks: data.remarks ?? '',
        breakdown: data.breakdown ?? { clarity: 0, specificity: 0, creativity: 0, instructions: 0 },
        promptSubmitted: true,
        timeTaken,
        evaluatedAt: serverTimestamp(),
      });

      setScoreData(data);
      setMode(MODES.RESULT);
    } catch (err) {
      console.error(err);
      setError(err.message || 'AI evaluation failed. Please try again.');
      setMode(MODES.PROMPT);
    }
  };

  const handleNextParticipant = () => {
    setMode(MODES.FORM);
    setPrompt('');
    setTimeLeft(TIMER_SECONDS);
    setScoreData(null);
    setParticipant({ name: '', regNo: '', id: '' });
    setError('');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-500 truncate max-w-xs sm:max-w-md">
            Session: <span className="font-semibold text-gray-800">{session.title}</span>
          </div>
          <button
            onClick={() => navigate(`/session/${sessionId}/leaderboard`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            Leaderboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {mode === MODES.FORM && <ParticipantForm onStart={handleStart} />}

        {mode === MODES.PROMPT && (
          <PromptInput
            participant={participant}
            prompt={prompt}
            setPrompt={setPrompt}
            timeLeft={timeLeft}
            onSubmit={handleSubmitPrompt}
          />
        )}

        {mode === MODES.LOADING && <AILoadingScreen />}

        {mode === MODES.RESULT && scoreData && (
          <div className="space-y-6">
            <ScoreBadge score={scoreData.totalScore} />
            <RemarksCard remarks={scoreData.remarks} />
            <ScoreBreakdown breakdown={scoreData.breakdown} />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate(`/session/${sessionId}/leaderboard`)}
                className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition"
              >
                View Leaderboard
              </button>
              <button
                onClick={handleNextParticipant}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                Next Participant
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
