import { MessageSquare } from 'lucide-react';

export default function RemarksCard({ remarks }) {
  if (!remarks) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Remarks</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">{remarks}</p>
    </div>
  );
}
