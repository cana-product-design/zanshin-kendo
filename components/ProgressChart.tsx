import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { UserProgress } from '../types';
import { Zap, Dumbbell, Award, Flame } from 'lucide-react';

interface ProgressChartProps {
  progress: UserProgress;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  const [metricView, setMetricView] = useState<'both' | 'xp' | 'workouts'>('both');

  // Fallback default history if none exists in progress
  const chartData = progress.history || [
    { week: "Week 1", xp: 300, completedSessions: 3 },
    { week: "Week 2", xp: 600, completedSessions: 6 },
    { week: "Week 3", xp: 900, completedSessions: 9 },
    { week: "Week 4", xp: 1200, completedSessions: 12 }
  ];

  // Custom styling elements to match Kendo theme
  const colors = {
    xp: '#EF4444',       // Lacquer Red / Rose-500
    workouts: '#D4AF37', // Gold
    grid: 'rgba(255, 255, 255, 0.05)',
    text: '#9CA3AF'      // Gray-400
  };

  // Custom tooltips matching the modern glassmorphic look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-4 border border-white/10 shadow-2xl backdrop-blur-md">
          <p className="font-bold text-white mb-2 tracking-wide text-xs uppercase text-gray-400">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, i: number) => (
              <p 
                key={i} 
                className="text-xs flex items-center gap-2 font-medium"
                style={{ color: entry.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name === 'XP' ? 'XP Earned' : 'Total Sessions'}: 
                <span className="font-bold text-white ml-auto">{entry.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="kenshi-progress-chart-card" className="glass rounded-3xl p-6 border border-white/5 space-y-6">
      {/* Title and Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Award size={18} className="text-red-500" />
            Kenshi Progression
          </h3>
          <p className="text-xs text-gray-400">Track your weekly discipline & XP over time</p>
        </div>

        {/* View Toggle Controls */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl self-start sm:self-center border border-white/5">
          <button
            onClick={() => setMetricView('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
              metricView === 'both' 
                ? 'bg-red-950/40 text-red-400 border border-red-900/30 shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMetricView('xp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
              metricView === 'xp' 
                ? 'bg-red-950/40 text-red-400 border border-red-900/30 shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            XP
          </button>
          <button
            onClick={() => setMetricView('workouts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
              metricView === 'workouts' 
                ? 'bg-red-950/40 text-red-400 border border-red-900/30 shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sessions
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-red-950/30 text-red-400 rounded-xl">
            <Zap size={16} />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total XP</span>
            <span className="text-base font-bold text-white">{progress.xp}</span>
          </div>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-yellow-950/30 text-yellow-500 rounded-xl">
            <Dumbbell size={16} />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sessions</span>
            <span className="text-base font-bold text-white">{progress.completedWorkouts}</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-orange-950/30 text-orange-400 rounded-xl">
            <Flame size={16} />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Streak</span>
            <span className="text-base font-bold text-white">{progress.streak} Days</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2 bg-blue-950/30 text-blue-400 rounded-xl">
            <Award size={16} />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rank</span>
            <span className="text-base font-bold text-white">Lv. {progress.level}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-60 min-h-[240px] relative pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="xpColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.xp} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.xp} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="workoutColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.workouts} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.workouts} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke={colors.text} 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            {/* Left YAxis for XP */}
            {(metricView === 'both' || metricView === 'xp') && (
              <YAxis 
                yAxisId="left"
                stroke={colors.xp}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-5}
                label={{ 
                  value: 'XP', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fill: colors.xp, fontSize: 10, fontWeight: 600, letterSpacing: 1 }
                }}
              />
            )}
            {/* Right YAxis for completed sessions */}
            {(metricView === 'both' || metricView === 'workouts') && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke={colors.workouts}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={5}
                label={{ 
                  value: 'SESSIONS', 
                  angle: 90, 
                  position: 'insideRight', 
                  style: { fill: colors.workouts, fontSize: 10, fontWeight: 600, letterSpacing: 1 }
                }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, letterSpacing: 0.5 }}
            />
            
            {/* Line for XP */}
            {(metricView === 'both' || metricView === 'xp') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="xp"
                name="XP"
                stroke={colors.xp}
                strokeWidth={3}
                dot={{ r: 4, stroke: '#0B1021', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: colors.xp, strokeWidth: 2 }}
                animationDuration={1500}
              />
            )}

            {/* Line for Sessions */}
            {(metricView === 'both' || metricView === 'workouts') && (
              <Line
                yAxisId={metricView === 'both' ? "right" : "left"} // Use left axis if we only show sessions to scale appropriately
                type="monotone"
                dataKey="completedSessions"
                name="Sessions"
                stroke={colors.workouts}
                strokeWidth={3}
                dot={{ r: 4, stroke: '#0B1021', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: colors.workouts, strokeWidth: 2 }}
                animationDuration={1500}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
