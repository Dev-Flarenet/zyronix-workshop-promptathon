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
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="animated-bg" />
        <p className="text-gray-400 animate-pulse">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium text-gray-400 hover:text-indigo-400 transition"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-400 truncate max-w-xs sm:max-w-md">
            Session: <span className="font-semibold text-white">{session.title}</span>
          </div>
          <button
            onClick={() => navigate(`/session/${sessionId}/leaderboard`)}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            Leaderboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm animate-slide-up">
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
                className="btn-secondary w-full sm:w-auto"
              >
                View Leaderboard
              </button>
              <button
                onClick={handleNextParticipant}
                className="btn-primary w-full sm:w-auto"
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
