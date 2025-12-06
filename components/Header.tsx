import React from 'react';
import { Mic, Waves } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <Waves className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            OmniScribe
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide">AI POWERED TRANSCRIPTION</p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-4">
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
          Powered by Gemini 2.5 Flash
        </span>
      </div>
    </header>
  );
};