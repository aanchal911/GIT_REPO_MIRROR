import React from 'react';
import { AnalysisResult } from '../types';
import ScoreGauge from './ScoreGauge';
import RadarMetrics from './RadarMetrics';
import RoadmapList from './RoadmapList';
import { Sparkles, RefreshCw, Briefcase, CheckCircle2, XCircle, GitCommit, FileText, Layers } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze Another
        </button>
      </div>

      {/* Top Grid: Score & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Left Column: Score & Summary */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          <ScoreGauge 
            score={result.totalScore} 
            level={result.level} 
            repoName={result.repoName} 
          />
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex-grow">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2 uppercase tracking-wide">Mentor Summary</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>
          </div>

          {/* New: Git Hygiene Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-3">
                <GitCommit className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Commit Intelligence</h4>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed">
                {result.commitAnalysis}
             </p>
          </div>
        </div>

        {/* Right Column: Role Fit, Readme Audit, Radar */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
           
           {/* Role Compatibility & Skills */}
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-200">
                        {result.targetRole ? `Fit for ${result.targetRole}` : 'Role Compatibility'}
                    </h3>
                </div>
                <span className={`text-2xl font-bold ${result.roleCompatibilityScore >= 70 ? 'text-emerald-400' : result.roleCompatibilityScore >= 40 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {result.roleCompatibilityScore}%
                </span>
             </div>
             
             <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${result.roleCompatibilityScore >= 70 ? 'bg-emerald-500' : result.roleCompatibilityScore >= 40 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    style={{ width: `${result.roleCompatibilityScore}%` }}
                />
             </div>
             
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {result.roleAnalysis}
             </p>

             {/* Enhanced Skill Heatmap */}
             <div>
                <h5 className="text-xs font-mono text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Detected Skills & Proficiency
                </h5>
                <div className="flex flex-wrap gap-2">
                    {result.detectedSkills.map((skill, idx) => {
                        let colorClass = 'bg-slate-800 border-slate-700 text-slate-400'; // Beginner
                        if (skill.proficiency === 'Intermediate') colorClass = 'bg-blue-900/30 border-blue-800 text-blue-300';
                        if (skill.proficiency === 'Advanced') colorClass = 'bg-emerald-900/30 border-emerald-800 text-emerald-300';

                        return (
                            <span key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${colorClass}`}>
                                {skill.name}
                                <span className="opacity-50 text-[10px] uppercase tracking-wide border-l pl-2 border-current">
                                    {skill.proficiency}
                                </span>
                            </span>
                        );
                    })}
                </div>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Readme Audit - New */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-200">README Quality</h3>
                </div>
                <div className="space-y-3">
                    {[
                        { label: 'Project Overview', val: result.readmeAudit.overview },
                        { label: 'Installation Guide', val: result.readmeAudit.installation },
                        { label: 'Usage Instructions', val: result.readmeAudit.usage },
                        { label: 'Visuals / Demo', val: result.readmeAudit.visuals },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/50">
                            <span className="text-sm text-slate-300">{item.label}</span>
                            {item.val ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-rose-500/50" />
                            )}
                        </div>
                    ))}
                </div>
             </div>

             {/* Radar Chart */}
             <RadarMetrics metrics={result.metrics} />
           </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <RoadmapList roadmap={result.roadmap} />
      
    </div>
  );
};

export default AnalysisDashboard;
