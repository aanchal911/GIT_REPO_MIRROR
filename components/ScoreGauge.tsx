import React from 'react';
import { RepoLevel } from '../types';
import { LEVEL_COLORS } from '../constants';

interface ScoreGaugeProps {
  score: number;
  level: RepoLevel;
  repoName: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, level, repoName }) => {
  // Calculate SVG arc for semi-circle
  const radius = 80;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Color determination based on score
  const getColor = (s: number) => {
    if (s < 40) return '#ea580c'; // Orange
    if (s < 70) return '#eab308'; // Yellow
    if (s < 85) return '#10b981'; // Emerald
    return '#3b82f6'; // Blue
  };

  const color = getColor(score);
  const levelColorClass = LEVEL_COLORS[level];

  return (
    <div className="flex flex-col items-center bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <h3 className="text-xl font-mono text-slate-300 mb-6 truncate max-w-full" title={repoName}>
        {repoName}
      </h3>
      
      <div className="relative w-64 h-32 flex justify-center overflow-hidden mb-4">
        <svg className="w-full h-full transform scale-125 origin-bottom" viewBox="0 0 200 100">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="15"
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 text-center">
            <span className="text-6xl font-bold text-white tracking-tighter">{score}</span>
            <span className="text-slate-500 text-lg ml-1">/100</span>
        </div>
      </div>
      
      <div className={`text-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-sm font-bold uppercase tracking-wider ${levelColorClass}`}>
        {level}
      </div>
    </div>
  );
};

export default ScoreGauge;
