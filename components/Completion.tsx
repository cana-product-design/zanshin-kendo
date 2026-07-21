import React, { useEffect, useState } from 'react';
import { generateSamuraiQuote } from '../services/geminiService';
import { STYLES } from '../constants';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface CompletionProps {
  onReset: () => void;
  xpEarned: number;
}

const Completion: React.FC<CompletionProps> = ({ onReset, xpEarned }) => {
  const [quote, setQuote] = useState<string>("Mediating...");

  useEffect(() => {
    generateSamuraiQuote().then(setQuote);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-fade-in">
      
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-800 to-green-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-pulse">
            <CheckCircle size={64} className="text-white" />
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0B1021] border border-green-800 text-green-500 font-bold px-4 py-1 rounded-full text-sm">
            +{xpEarned} XP
        </div>
      </div>

      <div>
        <h2 className="text-4xl font-light text-white mb-2">
            Completed
        </h2>
        <p className="text-gray-500 font-light">Session recorded in history.</p>
      </div>

      {/* Minimalist Quote Card */}
      <div className="relative w-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50"></div>
        <p className="font-serif text-xl italic leading-relaxed text-gray-200">
          "{quote}"
        </p>
        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mt-6">
            Zanshin Philosophy
        </p>
      </div>

      <button 
        onClick={onReset}
        className={`${STYLES.buttonSecondary} mt-8 flex items-center justify-center gap-2`}
      >
        <RefreshCw size={18} /> Return to Home
      </button>
    </div>
  );
};

export default Completion;