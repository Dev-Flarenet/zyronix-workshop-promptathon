import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Zap className="w-6 h-6" />
          <span>PROMPTATHON</span>
        </Link>
        <span className="text-sm text-gray-500 hidden sm:inline">
          AI-Powered Prompt Evaluation Portal
        </span>
      </div>
    </nav>
  );
}
