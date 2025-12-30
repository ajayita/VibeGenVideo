import React, { useState, useEffect } from 'react';
import { Key, X, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);

  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  useEffect(() => {
    // Check if process.env.API_KEY is available and not empty
    if (process.env.API_KEY && process.env.API_KEY.length > 0) {
      setHasEnvKey(true);
    }
  }, []);

  const handleSave = () => {
    setApiKey(inputValue);
    onClose();
  };

  const handleClear = () => {
    setInputValue('');
    setApiKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100 font-semibold">
            <Key className="w-5 h-5 text-cine-accent" />
            <span>API Configuration</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              VibeGen requires a Google Gemini API key to function. 
            </p>

            {/* Status Indicator */}
            <div className={`p-4 rounded-xl border ${hasEnvKey ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'}`}>
              <div className="flex items-start gap-3">
                {hasEnvKey ? (
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${hasEnvKey ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
                    {hasEnvKey ? 'Environment Key Detected' : 'No Environment Key Found'}
                  </h4>
                  <p className={`text-xs ${hasEnvKey ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                    {hasEnvKey 
                      ? "The app is running with a pre-configured key (e.g. AI Studio or .env). You don't need to add a custom key unless you want to override it." 
                      : "The app is not detecting a pre-configured key. You must provide your own key below to generate prompts."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Custom API Key (Override)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cine-accent font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-between items-center pt-1">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-cine-accent hover:underline flex items-center gap-1"
              >
                Get a Gemini API Key
                <span className="text-[10px] transform -rotate-45">➜</span>
              </a>
              {inputValue && (
                <button 
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-600 hover:underline"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-cine-accent hover:bg-cine-accent-hover text-white rounded-lg text-sm font-medium shadow-lg shadow-cine-accent/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};