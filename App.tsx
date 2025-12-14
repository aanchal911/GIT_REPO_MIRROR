import React, { useState } from 'react';
import RepoInput from './components/RepoInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AnalysisResult } from './types';
import { parseRepoUrl, fetchRepoDetails } from './services/githubService';
import { analyzeRepositoryWithGemini } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (url: string, role: string) => {
    setLoading(true);
    setError(null);

    try {
      const repoInfo = parseRepoUrl(url);
      if (!repoInfo) {
        throw new Error("Invalid GitHub URL. Use format: https://github.com/owner/repo");
      }

      // 1. Fetch data from GitHub
      const repoData = await fetchRepoDetails(repoInfo.owner, repoInfo.repo);
      
      // 2. Analyze with Gemini (pass optional role)
      const analysis = await analyzeRepositoryWithGemini(repoData, role);
      
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-brand-500/30 selection:text-brand-100 flex flex-col">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <main className="relative z-10 flex-grow flex flex-col">
            {!result ? (
                <div className="flex-grow flex flex-col justify-center items-center p-4">
                    <RepoInput onAnalyze={handleAnalyze} isLoading={loading} />
                    
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 max-w-md animate-in slide-in-from-bottom-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>
            ) : (
                <AnalysisDashboard result={result} onReset={handleReset} />
            )}
        </main>
        
        <footer className="relative z-10 py-6 text-center text-slate-600 text-xs font-mono">
            
        </footer>
    </div>
  );
}

export default App;