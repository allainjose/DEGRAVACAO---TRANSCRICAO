import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { HistoryList } from './components/HistoryList';
import { TranscriptionStatus, TabOption, HistoryItem } from './types';
import { fileToBase64, transcribeAudio } from './services/geminiService';
import { Loader2, Music, Youtube, Instagram, Facebook } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<TranscriptionStatus>(TranscriptionStatus.IDLE);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<TabOption>(TabOption.UPLOAD);
  
  // New features state
  const [progress, setProgress] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    // Load history from local storage on init
    const saved = localStorage.getItem('omniscribe_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const progressInterval = useRef<number | null>(null);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('omniscribe_history', JSON.stringify(history));
  }, [history]);

  const simulateProgress = () => {
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => {
        // Fast at first, slows down as it reaches 90%, waits for actual completion
        if (prev >= 90) return 90;
        const increment = prev < 50 ? 5 : 2;
        return prev + increment;
      });
    }, 500);
  };

  const handleFileProcess = async (file: File) => {
    try {
      setStatus(TranscriptionStatus.UPLOADING);
      setFileName(file.name);
      setTranscription(null);
      setProgress(0);

      // 1. Convert to Base64
      const base64 = await fileToBase64(file);

      setStatus(TranscriptionStatus.PROCESSING);
      simulateProgress();
      
      // 2. Send to Gemini
      const text = await transcribeAudio(base64, file.type);
      
      // Clear interval and set to 100%
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);

      setTranscription(text);
      setStatus(TranscriptionStatus.COMPLETED);

      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        filename: file.name,
        markdown: text,
        timestamp: new Date()
      };
      
      setHistory(prev => [newItem, ...prev]);

    } catch (error) {
      console.error(error);
      if (progressInterval.current) clearInterval(progressInterval.current);
      setStatus(TranscriptionStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(TranscriptionStatus.IDLE);
    setTranscription(null);
    setFileName('');
    setProgress(0);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setFileName(item.filename);
    setTranscription(item.markdown);
    setStatus(TranscriptionStatus.COMPLETED);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistoryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 pb-12">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Intro Section */}
        {status === TranscriptionStatus.IDLE && (
           <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
               Turn Audio into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfect Text</span>
             </h2>
             <p className="text-lg text-slate-400 max-w-2xl mx-auto">
               Upload audio or video files from your favorite social platforms. 
               Powered by Google's Gemini AI for unmatched accuracy.
             </p>
           </div>
        )}

        {/* Tab Navigation (for future extensibility) */}
        {status === TranscriptionStatus.IDLE && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 inline-flex">
              <button
                onClick={() => setCurrentTab(TabOption.UPLOAD)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === TabOption.UPLOAD 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setCurrentTab(TabOption.URL)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === TabOption.URL 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Social Links
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center w-full">
          
          {/* UPLOAD VIEW */}
          {status === TranscriptionStatus.IDLE && currentTab === TabOption.UPLOAD && (
            <FileUpload onFileSelect={handleFileProcess} status={status} />
          )}

          {/* URL VIEW (Informational) */}
          {status === TranscriptionStatus.IDLE && currentTab === TabOption.URL && (
            <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-center gap-6 mb-6">
                <Youtube className="w-8 h-8 text-red-500" />
                <Instagram className="w-8 h-8 text-pink-500" />
                <Facebook className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Transcribing Social Links</h3>
              <p className="text-slate-400 mb-6">
                To transcribe content from YouTube, Instagram, or Facebook, please <strong>download the video or audio file</strong> first.
              </p>
              <div className="bg-slate-900/50 p-4 rounded-lg text-left text-sm text-slate-400 border border-slate-800">
                <p className="mb-2"><span className="text-indigo-400 font-bold">Why?</span> Direct URL streaming requires server-side downloading which isn't available in this browser-only demo.</p>
                <p>Once you have the file (MP4, MP3), simply switch to the <strong>Upload File</strong> tab to get a full AI transcription.</p>
              </div>
              <button 
                onClick={() => setCurrentTab(TabOption.UPLOAD)}
                className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium text-sm underline underline-offset-4"
              >
                Go to Upload
              </button>
            </div>
          )}

          {/* PROCESSING STATE WITH PROGRESS */}
          {(status === TranscriptionStatus.UPLOADING || status === TranscriptionStatus.PROCESSING) && (
            <div className="flex flex-col items-center justify-center py-10 w-full max-w-lg animate-in fade-in duration-500">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {status === TranscriptionStatus.UPLOADING ? 'Uploading...' : 'Transcribing...'}
              </h3>
              
              {/* Progress Bar */}
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-slate-400 text-center mt-6 text-sm">
                Gemini is listening to your audio. Please wait while we generate the text.
              </p>
            </div>
          )}

          {/* RESULT STATE */}
          {status === TranscriptionStatus.COMPLETED && transcription && (
            <div className="w-full">
              <TranscriptionDisplay markdown={transcription} filename={fileName} />
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  Transcribe Another File
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {status === TranscriptionStatus.ERROR && (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                 <Music className="w-8 h-8 text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
               <p className="text-slate-400 mb-6">We couldn't transcribe that file. Please try again with a standard audio format.</p>
               <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
             </div>
          )}
          
          {/* HISTORY SECTION */}
          {status !== TranscriptionStatus.UPLOADING && status !== TranscriptionStatus.PROCESSING && (
            <HistoryList 
              history={history} 
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;