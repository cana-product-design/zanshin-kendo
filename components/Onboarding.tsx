import React, { useState } from 'react';
import { KendoLevel, UserProfile } from '../types';
import { STYLES } from '../constants';
import { ChevronRight, Activity, Ruler, Weight, User } from 'lucide-react';

interface OnboardingProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    level: KendoLevel.BEGINNER,
    injuries: '',
    goals: ''
  });

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-t-2 border-r-2 border-red-800 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-light text-white">Sensei is Thinking</h2>
          <p className="text-sm text-gray-500 mt-2">Designing your path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-light tracking-tight text-white">Welcome, <span className="font-bold text-red-500">Kenshi.</span></h2>
        <p className="text-gray-400 font-light">Input your metrics to begin your conditioning.</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className={STYLES.label}>Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              className={`${STYLES.input} pl-12`}
              placeholder="Your Name"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={STYLES.label}>Age</label>
            <input 
              type="number" 
              className={`${STYLES.input} text-center`}
              value={profile.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className={STYLES.label}>Weight (KG)</label>
            <input 
              type="number" 
              className={`${STYLES.input} text-center`}
              value={profile.weight}
              onChange={(e) => handleChange('weight', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className={STYLES.label}>Height (CM)</label>
            <input 
              type="number" 
              className={`${STYLES.input} text-center`}
              value={profile.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Level */}
        <div>
          <label className={STYLES.label}>Rank</label>
          <select 
            className={`${STYLES.input} appearance-none`}
            value={profile.level}
            onChange={(e) => handleChange('level', e.target.value)}
          >
            {Object.values(KendoLevel).map(level => (
              <option key={level} value={level} className="bg-[#0B1021]">{level}</option>
            ))}
          </select>
        </div>

        {/* Goals */}
        <div>
          <label className={STYLES.label}>Focus Area</label>
          <div className="relative">
            <Activity className="absolute left-4 top-4 text-gray-500" size={18} />
            <textarea 
              className={`${STYLES.input} pl-12 resize-none`}
              rows={2}
              placeholder="Faster fumikomi, stronger tenouchi..."
              value={profile.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
            />
          </div>
        </div>

         {/* Injuries */}
         <div>
          <label className={STYLES.label}>Conditions / Injuries</label>
          <textarea 
            className={`${STYLES.input} resize-none`}
            rows={1}
            placeholder="Left knee pain, etc..."
            value={profile.injuries}
            onChange={(e) => handleChange('injuries', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={() => onSubmit(profile)}
          className={STYLES.buttonPrimary}
        >
          <div className="flex items-center justify-between">
            <span>Generate Plan</span>
            <ChevronRight className="w-5 h-5 opacity-80" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;