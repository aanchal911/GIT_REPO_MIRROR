import React, { useState } from 'react';
import { Search, Github, Loader2, Briefcase } from 'lucide-react';

interface RepoInputProps {
  onAnalyze: (url: string, role: string) => void;
  isLoading: boolean;
}

const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url, role);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-brand-900/30 rounded-xl mb-6">
            <Github className="w-10 h-10 text-brand-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Repository Mirror
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Discover how recruiters see your code. Get an AI-powered score, role compatibility check, and a roadmap to level up.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto group space-y-3">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-brand-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Repo URL Input */}
        <div className="relative flex items-center bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-brand-500 transition-all z-10">
          <div className="pl-4 text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder:text-slate-500 font-mono text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Target Role Input & Button */}
        <div className="flex gap-3 z-10 relative">
          <div className="relative flex-grow flex items-center bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <div className="pl-4 text-slate-500">
              <Briefcase className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Target Job Role (Optional)"
              className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder:text-slate-500 font-sans text-sm"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !url}
            className="px-6 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg min-w-[120px]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Analyze</span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 flex justify-center gap-4 text-xs text-slate-500 font-mono uppercase tracking-widest">
        <span>Skill Analysis</span>
        <span>•</span>
        <span>Role Fit</span>
        <span>•</span>
        <span>Roadmap</span>
      </div>
    </div>
  );
};

export default RepoInput;
