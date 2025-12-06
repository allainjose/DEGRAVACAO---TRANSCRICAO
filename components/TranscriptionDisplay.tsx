import React, { useState } from 'react';
import { Copy, Download, Check, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TranscriptionDisplayProps {
  markdown: string;
  filename: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ markdown, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${filename}.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">Transcription Ready</h3>
                <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-md">{filename}</p>
            </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="h-[60vh] overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};