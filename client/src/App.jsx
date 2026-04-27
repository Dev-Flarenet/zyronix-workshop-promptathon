import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SessionPage from './pages/SessionPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:sessionId" element={<SessionPage />} />
        <Route path="/session/:sessionId/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
