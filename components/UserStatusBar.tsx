import React, { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { 
  Shield, 
  Swords, 
  Compass, 
  Award, 
  Flame, 
  Crown, 
  Zap, 
  Target, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface UserStatusBarProps {
  progress: UserProgress;
}

interface RankInfo {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  glowClass: string;
}

const getRankInfo = (level: number): RankInfo => {
  if (level <= 1) {
    return {
      title: "Muji",
      subtitle: "Keiko (Novice)",
      icon: <Shield size={18} className="text-slate-400" />,
      colorClass: "text-slate-400",
      bgClass: "bg-slate-500/10 border-slate-500/20",
      glowClass: "shadow-slate-500/10"
    };
  } else if (level === 2) {
    return {
      title: "Ronin",
      subtitle: "Wandering Swordsman",
      icon: <Compass size={18} className="text-rose-400" />,
      colorClass: "text-rose-400",
      bgClass: "bg-rose-500/10 border-rose-500/20",
      glowClass: "shadow-rose-500/10"
    };
  } else if (level === 3) {
    return {
      title: "Bushi",
      subtitle: "Armored Samurai",
      icon: <Swords size={18} className="text-cyan-400" />,
      colorClass: "text-cyan-400",
      bgClass: "bg-cyan-500/10 border-cyan-500/20",
      glowClass: "shadow-cyan-500/10"
    };
  } else if (level === 4) {
    return {
      title: "Mushae",
      subtitle: "Elite Defender",
      icon: <Target size={18} className="text-amber-500" />,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      glowClass: "shadow-amber-500/10"
    };
  } else if (level === 5) {
    return {
      title: "Sensei",
      subtitle: "Master Instructor",
      icon: <Flame size={18} className="text-red-500" />,
      colorClass: "text-red-500",
      bgClass: "bg-red-500/10 border-red-500/20",
      glowClass: "shadow-red-500/20"
    };
  } else if (level === 6) {
    return {
      title: "Daimyo",
      subtitle: "Noble Lord",
      icon: <Trophy size={18} className="text-indigo-400" />,
      colorClass: "text-indigo-400",
      bgClass: "bg-indigo-500/10 border-indigo-500/20",
      glowClass: "shadow-indigo-500/20"
    };
  } else {
    return {
      title: "Shogun",
      subtitle: "Supreme Commander",
      icon: <Crown size={18} className="text-amber-400 animate-pulse" />,
      colorClass: "text-amber-400",
      bgClass: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30",
      glowClass: "shadow-amber-500/30"
    };
  }
};

const UserStatusBar: React.FC<UserStatusBarProps> = ({ progress }) => {
  const [animateXp, setAnimateXp] = useState(false);
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const [xpDiff, setXpDiff] = useState(0);
  const prevXpRef = useRef(progress.xp);

  useEffect(() => {
    if (progress.xp > prevXpRef.current) {
      const diff = progress.xp - prevXpRef.current;
      setXpDiff(diff);
      setAnimateXp(true);
      setShowFloatingXp(true);

      const xpTimer = setTimeout(() => setAnimateXp(false), 800);
      const floatTimer = setTimeout(() => setShowFloatingXp(false), 1500);

      prevXpRef.current = progress.xp;
      return () => {
        clearTimeout(xpTimer);
        clearTimeout(floatTimer);
      };
    } else if (progress.xp !== prevXpRef.current) {
      prevXpRef.current = progress.xp;
    }
  }, [progress.xp]);

  const rank = getRankInfo(progress.level);

  // Calculate progress to next level (assuming 500 XP per level, or relative to current level)
  const xpPerLevel = 500;
  const currentLevelXp = progress.xp % xpPerLevel;
  const progressPercentage = Math.min((currentLevelXp / xpPerLevel) * 100, 100);

  return (
    <div id="kenshi-user-status-bar" className="mb-6 glass rounded-2xl p-4 border border-white/5 relative overflow-hidden">
      {/* CSS Keyframes for XP effects */}
      <style>{`
        @keyframes floatUpFade {
          0% {
            transform: translateY(12px) scale(0.85);
            opacity: 0;
          }
          15% {
            transform: translateY(-5px) scale(1.15);
            opacity: 1;
          }
          30% {
            transform: translateY(-10px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-45px) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes borderPulse {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.4);
            box-shadow: 0 0 12px 2px rgba(239, 68, 68, 0.15);
          }
        }

        .float-up-xp {
          animation: floatUpFade 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .pulse-border-active {
          animation: borderPulse 1s ease-out 1;
        }
      `}</style>

      {/* Subtle glowing effect during active XP gain */}
      <div className={`absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 pointer-events-none transition-opacity duration-500 ${animateXp ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="flex items-center justify-between relative z-10">
        {/* Left Side: Rank Title & Badge */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${rank.bgClass} shadow-inner transition-all duration-300`}>
            {rank.icon}
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Rank</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">{rank.title}</span>
              <span className="text-xs text-gray-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">Lv. {progress.level}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-none mt-0.5">{rank.subtitle}</span>
          </div>
        </div>

        {/* Right Side: Animated XP Counter */}
        <div className="flex items-center gap-3 relative">
          {/* Floating +XP Indicator */}
          {showFloatingXp && (
            <div className="absolute right-0 -top-4 float-up-xp pointer-events-none z-50">
              <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.3)] flex items-center gap-0.5">
                <Sparkles size={10} className="animate-spin text-white" />
                +{xpDiff} XP
              </span>
            </div>
          )}

          <div className="text-right">
            <span className="block text-[10px] text-red-400 font-bold uppercase tracking-widest mb-0.5">Discipline</span>
            <div className="flex items-baseline justify-end gap-1">
              <span 
                className={`block text-2xl font-black text-white leading-none tracking-tight transition-all duration-300 ${
                  animateXp ? 'scale-115 text-red-400 font-extrabold rotate-[-1deg]' : ''
                }`}
              >
                {progress.xp}
              </span>
              <span className="text-xs text-gray-400 font-bold">XP</span>
            </div>
          </div>

          <div 
            className={`w-11 h-11 rounded-2xl bg-red-950/20 flex items-center justify-center border transition-all duration-300 ${
              animateXp ? 'bg-red-900/30 border-red-500/50 text-red-400 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-white/5 text-red-500'
            }`}
          >
            <Zap size={22} fill={animateXp ? "currentColor" : "none"} className={animateXp ? 'animate-bounce' : ''} />
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
          <span className="font-mono">LV.{progress.level}</span>
          <span className="font-mono">{currentLevelXp} / {xpPerLevel} XP TO LV.{progress.level + 1}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02]">
          <div 
            className={`h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 transition-all duration-700 ease-out ${
              animateXp ? 'brightness-125 saturate-150 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusBar;
