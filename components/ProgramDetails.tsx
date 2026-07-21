import React from 'react';
import { TrainingPlan, TrainingSession } from '../types';
import { STYLES } from '../constants';
import { ArrowLeft, Play, Clock, Zap } from 'lucide-react';

interface ProgramDetailsProps {
  plan: TrainingPlan;
  onSelectSession: (session: TrainingSession) => void;
  onBack: () => void;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ plan, onSelectSession, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div className="relative">
        <button 
            onClick={onBack} 
            className="absolute -top-1 left-0 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
        >
            <ArrowLeft size={20} />
        </button>
        <div className="pt-12">
             <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 block">
                {plan.durationWeeks} Week Cycle
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">{plan.programTitle}</h2>
            <p className="text-gray-400 font-light leading-relaxed">{plan.description}</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider sticky top-[72px] bg-[#050811]/90 backdrop-blur py-3 z-10">
            Weekly Schedule
        </h3>
        
        {plan.sessions.map((session, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectSession(session)}
            className={`${STYLES.card} p-5 cursor-pointer hover:bg-white/5 border border-white/5 flex items-center justify-between group`}
          >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-sm">
                        {session.dayLabel}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {session.durationMinutes} min
                    </span>
                </div>
                <h4 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                    {session.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <Zap size={12} className="text-red-500" />
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{session.focus}</p>
                </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                <Play size={18} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-2xl mt-8">
        <p className="text-xs text-red-200 text-center leading-relaxed">
            <span className="font-bold">Sensei's Note:</span> Repeat this weekly schedule for 4 weeks. Increase weight or intensity each week (Progressive Overload).
        </p>
      </div>
    </div>
  );
};

export default ProgramDetails;