import React from 'react';
import { TrainingPlan, TrainingEnvironment, UserProgress } from '../types';
import { STYLES } from '../constants';
import { Calendar, Dumbbell, ArrowRight } from 'lucide-react';
import ProgressChart from './ProgressChart';

interface PlanDashboardProps {
  plans: TrainingPlan[];
  onSelectPlan: (plan: TrainingPlan) => void;
  progress: UserProgress;
}

const IMAGES = {
  [TrainingEnvironment.GYM]: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
  [TrainingEnvironment.HOME]: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000",
  [TrainingEnvironment.DOJO]: "https://images.unsplash.com/photo-1544367563-12123d81a57c?auto=format&fit=crop&q=80&w=1000"
};

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plans, onSelectPlan, progress }) => {
  return (
    <div className="space-y-6">
      <ProgressChart progress={progress} />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-light text-white">Select Environment</h2>
        <p className="text-sm text-gray-400">Choose your 4-week path.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectPlan(plan)}
            className={`${STYLES.card} group relative h-64 cursor-pointer border-0`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
                <img 
                    src={IMAGES[plan.environment]} 
                    alt={plan.environment} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 z-10">
              <div className="flex justify-between items-end">
                <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-900/20 px-2 py-1 rounded">
                            {plan.environment}
                        </span>
                        <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded backdrop-blur-md">
                            {plan.durationWeeks} Week Program
                        </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {plan.programTitle || `${plan.environment} Master`}
                    </h3>

                    <p className="text-sm text-gray-300 line-clamp-2 mb-4 font-light opacity-80">
                        {plan.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-red-500" /> 
                            {plan.frequencyPerWeek} Workouts / Week
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Dumbbell size={14} className="text-red-500" /> 
                            {plan.sessions.length} Unique Sessions
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDashboard;