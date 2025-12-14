import React from 'react';
import { RoadmapItem } from '../types';
import { CheckCircle2, ArrowRight, BookOpen, PenTool, Layout, Box, ShieldCheck } from 'lucide-react';

interface RoadmapListProps {
  roadmap: RoadmapItem[];
}

const getIcon = (category: string) => {
  switch(category) {
    case 'Structure': return <Layout className="w-4 h-4" />;
    case 'Code Quality': return <PenTool className="w-4 h-4" />;
    case 'Documentation': return <BookOpen className="w-4 h-4" />;
    case 'Testing': return <ShieldCheck className="w-4 h-4" />;
    default: return <Box className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
    switch(priority) {
        case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
}

const RoadmapList: React.FC<RoadmapListProps> = ({ roadmap }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowRight className="text-brand-400" />
          Personalized Roadmap
        </h3>
        <span className="text-xs font-mono text-slate-500 uppercase">Action Plan</span>
      </div>

      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all duration-300"
          >
            {/* Step Number Line */}
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs group-hover:bg-brand-900 group-hover:text-brand-400 transition-colors">
                    {index + 1}
                </div>
                {index !== roadmap.length - 1 && (
                    <div className="w-px h-full bg-slate-800 my-2 group-hover:bg-slate-700 transition-colors" />
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {getIcon(item.category)}
                        {item.category}
                    </span>
                </div>
                <h4 className="text-slate-200 font-medium mb-1 group-hover:text-white transition-colors">
                    {item.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                </p>
            </div>
            
            <div className="hidden sm:flex items-start text-slate-600 group-hover:text-brand-500 transition-colors pt-1">
                <CheckCircle2 className="w-5 h-5 opacity-20 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapList;
