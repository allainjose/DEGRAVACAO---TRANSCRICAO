import React from 'react';
import { FileText, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-400" />
        Recent Transcriptions
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-indigo-500/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <button 
                onClick={(e) => onDelete(item.id, e)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h4 className="font-medium text-slate-200 truncate pr-2 mb-1" title={item.filename}>
              {item.filename}
            </h4>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-500">
                {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};