import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio, AlertCircle } from 'lucide-react';
import { TranscriptionStatus } from '../types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  status: TranscriptionStatus;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, status }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndProcessFile = (file: File) => {
    // Check if file is audio or video
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setError("Please upload a valid audio or video file (MP3, WAV, M4A, MP4).");
      return;
    }
    
    // Size limit check (e.g., 50MB for browser-based base64 handling safety)
    // Gemini can handle larger, but browser memory is the bottleneck here.
    const maxSize = 50 * 1024 * 1024; 
    if (file.size > maxSize) {
      setError("File is too large for the browser demo. Limit is 50MB.");
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const isProcessing = status === TranscriptionStatus.PROCESSING || status === TranscriptionStatus.UPLOADING;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleChange}
          accept="audio/*,video/*"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${dragActive ? 'scale-110 bg-indigo-500/20' : 'bg-slate-700/50 group-hover:bg-slate-700'}`}>
            <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Drag & Drop audio file
          </h3>
          <p className="text-slate-400 mb-6 max-w-xs">
            Supports MP3, WAV, M4A, MP4 from downloads (YouTube, IG, etc.)
          </p>
          
          <button className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-600/20">
            Browse Files
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};