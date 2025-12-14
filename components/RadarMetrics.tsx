import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { RepoMetric } from '../types';

interface RadarMetricsProps {
  metrics: RepoMetric[];
}

const RadarMetrics: React.FC<RadarMetricsProps> = ({ metrics }) => {
  // Transform data for Recharts
  const data = metrics.map(m => ({
    subject: m.category,
    A: m.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[350px] bg-slate-800/50 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm relative flex flex-col items-center justify-center">
      <h3 className="absolute top-4 left-6 text-sm font-mono text-slate-400 uppercase tracking-wider">Analysis Dimensions</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#0ea5e9"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#38bdf8' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarMetrics;
