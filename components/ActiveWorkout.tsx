
import React, { useState } from 'react';
import { TrainingSession } from '../types';
import { STYLES } from '../constants';
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react';

interface ActiveWorkoutProps {
  session: TrainingSession;
  onComplete: () => void;
  onBack: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  WARMUP: 'text-yellow-400 bg-yellow-400/10',
  STRENGTH: 'text-red-400 bg-red-400/10',
  CARDIO: 'text-blue-400 bg-blue-400/10',
  HIIT: 'text-orange-400 bg-orange-400/10',
  SKILL: 'text-purple-400 bg-purple-400/10',
  COOLDOWN: 'text-teal-400 bg-teal-400/10'
};

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ session, onComplete, onBack }) => {
  const [checkedExercises, setCheckedExercises] = useState<Set<number>>(new Set());

  const toggleExercise = (index: number) => {
    const next = new Set(checkedExercises);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedExercises(next);
  };

  const progress = Math.round((checkedExercises.size / session.exercises.length) * 100);
  const isFinished = checkedExercises.size === session.exercises.length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
            <h2 className="text-lg font-bold text-white leading-none">{session.title}</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{session.focus}</p>
        </div>
        <div className="text-right">
             <span className="text-2xl font-light text-red-500">{progress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-red-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {session.exercises.map((ex, idx) => {
          const isChecked = checkedExercises.has(idx);
          const categoryStyle = CATEGORY_COLORS[ex.category] || 'text-gray-400 bg-gray-400/10';

          return (
            <div 
              key={idx} 
              onClick={() => toggleExercise(idx)}
              className={`${STYLES.card} p-5 flex gap-5 items-start cursor-pointer border border-transparent ${isChecked ? 'bg-green-900/20 border-green-900/30' : 'hover:bg-white/5'}`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-green-600 border-green-600' : 'border-gray-600'}`}>
                {isChecked && <Check size={14} className="text-white" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-lg ${isChecked ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {ex.name}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${categoryStyle}`}>
                      {ex.category}
                    </span>
                </div>
                
                <div className="flex gap-3 text-xs font-bold mt-2 mb-3">
                    <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{ex.sets} Sets</span>
                    <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{ex.reps}</span>
                </div>
                
                <p className={`text-sm font-light leading-relaxed ${isChecked ? 'text-gray-600' : 'text-gray-400'}`}>{ex.description}</p>
                
                {!isChecked && (
                    <p className="text-[10px] uppercase font-bold text-red-400 mt-3 tracking-wider">
                        Target: {ex.muscleFocus}
                    </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button for completion */}
      <div className="fixed bottom-8 left-0 w-full px-6 z-30 safe-bottom">
        <button 
            onClick={onComplete}
            disabled={!isFinished}
            className={`w-full py-4 rounded-2xl shadow-xl backdrop-blur-md font-bold text-lg tracking-wide transition-all duration-300 ${
                isFinished 
                ? 'bg-red-700 text-white shadow-red-900/50 scale-100' 
                : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
        >
            {isFinished ? 'Complete Session' : 'Finish Exercises'}
        </button>
      </div>
    </div>
  );
};

export default ActiveWorkout;
