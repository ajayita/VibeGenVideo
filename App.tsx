import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { HistorySection } from './components/HistorySection';
import { InfoSection } from './components/InfoSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateVideoPrompt } from './services/geminiService';
import { LoadingState, HistoryItem, PresetVibe } from './types';
import { Clapperboard, Moon, Sun, Key } from 'lucide-react';
import { DEFAULT_VIBES } from './assets/default_vibes';
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from './assets/models';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [vibestack, setVibestack] = useState('');
  const [duration, setDuration] = useState('8s');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  
  const [result, setResult] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // API Key State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vibegen_api_key') || '';
    }
    return '';
  });

  // Initialize dark mode from localStorage or default to true
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibegen_theme');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Initialize history from localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vibegen_history');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Failed to load history:', error);
        return [];
      }
    }
    return [];
  });

  // Initialize vibes from localStorage or default
  const [vibes, setVibes] = useState<PresetVibe[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vibegen_vibes');
        if (saved) return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load vibes:', error);
      }
    }
    return DEFAULT_VIBES;
  });

  // Toggle Dark Mode Class on HTML element and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vibegen_theme', String(isDarkMode));
  }, [isDarkMode]);

  // Persist history changes to localStorage
  useEffect(() => {
    localStorage.setItem('vibegen_history', JSON.stringify(history));
  }, [history]);

  // Persist vibes changes to localStorage
  useEffect(() => {
    localStorage.setItem('vibegen_vibes', JSON.stringify(vibes));
  }, [vibes]);

  // Persist API Key
  useEffect(() => {
    localStorage.setItem('vibegen_api_key', customApiKey);
  }, [customApiKey]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddVibe = (vibe: PresetVibe) => {
    setVibes(prev => [...prev, vibe]);
  };

  const handleDeleteVibe = (id: string) => {
    setVibes(prev => prev.filter(v => v.id !== id));
  };

  const handleResetVibes = () => {
    if (window.confirm("Are you sure you want to reset all presets to default? Custom presets will be lost.")) {
      setVibes(DEFAULT_VIBES);
    }
  };

  const handleImportVibes = (newVibes: PresetVibe[]) => {
    // Append new vibes to existing ones
    setVibes(prev => {
      // Avoid duplicates by ID
      const existingIds = new Set(prev.map(v => v.id));
      const filteredNew = newVibes.filter(v => !existingIds.has(v.id));
      return [...prev, ...filteredNew];
    });
  };

  const handleGenerate = async () => {
    if (!topic || !vibestack) return;

    setLoadingState(LoadingState.LOADING);
    setErrorMessage(null);
    setResult('');

    try {
      const generatedText = await generateVideoPrompt(topic, vibestack, duration, selectedModel, customApiKey);
      setResult(generatedText);
      setLoadingState(LoadingState.SUCCESS);

      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        topic,
        vibestack,
        duration,
        modelId: selectedModel,
        generatedPrompt: generatedText,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (error: any) {
      setLoadingState(LoadingState.ERROR);
      
      // If error is about API key, open the modal
      if (error.message && (error.message.includes('API Key') || error.message.includes('403'))) {
        setIsApiKeyModalOpen(true);
      }
      
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleRestore = (item: HistoryItem) => {
    setTopic(item.topic);
    setVibestack(item.vibestack);
    // If old history item doesn't have duration, default to 8s
    setDuration(item.duration || '8s');
    // If old history doesn't have modelId, default to current default
    setSelectedModel(item.modelId || DEFAULT_MODEL_ID);
    setResult(item.generatedPrompt);
    // Scroll to top to show the inputs/result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-cine-accent selection:text-white pb-20">
      
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        apiKey={customApiKey}
        setApiKey={setCustomApiKey}
      />

      {/* Header / Nav */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cine-accent to-purple-600 p-2 rounded-lg shadow-lg dark:shadow-none">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
              VibeGen <span className="text-zinc-500 dark:text-zinc-600 font-light">Architect</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* API Key Button */}
            <button 
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`p-2 rounded-full transition-colors ${
                customApiKey || (process.env.API_KEY && process.env.API_KEY.length > 0)
                  ? 'text-zinc-400 hover:text-cine-accent hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  : 'text-amber-500 hover:text-amber-600 bg-amber-100 dark:bg-amber-900/20'
              }`}
              title="Configure API Key"
              aria-label="Configure API Key"
            >
              <Key className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono hidden sm:block">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500 mb-4">
            Design Your Scene
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Fuse your core subject with a cinematic vibestack to architect the perfect prompt for Sora, Runway, or Pika.
          </p>
        </div>

        <InputSection 
          topic={topic}
          setTopic={setTopic}
          vibestack={vibestack}
          setVibestack={setVibestack}
          duration={duration}
          setDuration={setDuration}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onGenerate={handleGenerate}
          isLoading={loadingState === LoadingState.LOADING}
          vibes={vibes}
          onAddVibe={handleAddVibe}
          onDeleteVibe={handleDeleteVibe}
          onResetVibes={handleResetVibes}
          onImportVibes={handleImportVibes}
        />

        {/* Info Section - Always visible now, but collapsible */}
        <InfoSection />

        {/* Error Message */}
        {loadingState === LoadingState.ERROR && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-700 dark:text-red-200 text-center animate-fade-in-down">
            <p className="font-semibold">Generation Failed</p>
            <p className="text-sm opacity-80 mt-1">{errorMessage}</p>
            {errorMessage?.includes('API Key') && (
               <button 
                 onClick={() => setIsApiKeyModalOpen(true)}
                 className="mt-3 text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 px-3 py-1.5 rounded-md hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
               >
                 Open API Settings
               </button>
            )}
          </div>
        )}

        <ResultSection result={result} />

        <HistorySection history={history} onRestore={handleRestore} />

      </main>

      <footer className="text-center text-zinc-400 dark:text-zinc-600 text-sm py-12 transition-colors duration-300 flex flex-col items-center gap-2">
        <p>Powered by Google Gemini &bull; Designed for Text-to-Video AI</p>
        <a 
          href="https://github.com/ajayita/VibeGenVideo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-cine-accent transition-colors underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4"
        >
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;