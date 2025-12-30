import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronDown, ChevronUp, Copy, Check, RotateCcw, FileText, Sparkles, AlignLeft, Timer, Cpu } from 'lucide-react';
import { AVAILABLE_MODELS } from '../assets/models';

interface HistorySectionProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
}

const HistoryCard = ({ item, onRestore }: { item: HistoryItem, onRestore: (item: HistoryItem) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getModelName = (id?: string) => {
    if (!id) return 'Unknown Model';
    const model = AVAILABLE_MODELS.find(m => m.id === id);
    return model ? model.name : id;
  };

  const wordCount = item.generatedPrompt.split(/\s+/).filter(w => w.length > 0).length;
  const topicPreview = item.topic.length > 80 ? item.topic.substring(0, 80) + '...' : item.topic;

  return (
    <div className={`border transition-all duration-300 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 ${isOpen ? 'border-cine-accent/50 shadow-lg ring-1 ring-cine-accent/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 transition-colors text-left"
      >
        <div className="flex items-start gap-4 overflow-hidden">
          <div className={`mt-1 p-2 rounded-lg flex-shrink-0 transition-colors ${isOpen ? 'bg-cine-accent/10 text-cine-accent' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className={`font-medium text-sm truncate pr-4 transition-colors ${isOpen ? 'text-cine-accent' : 'text-zinc-900 dark:text-zinc-200'}`}>
              {topicPreview}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span>{formatTime(item.timestamp)}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span className="flex items-center gap-1">
                <AlignLeft className="w-3 h-3" />
                {wordCount} words
              </span>
            </div>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-cine-accent" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 animate-fade-in-down">
          
          {/* Inputs Section */}
          <div className="p-5 bg-zinc-50/50 dark:bg-black/20">
            
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 mb-5 pb-5 border-b border-zinc-200 dark:border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-cine-accent shadow-sm">
                   <Timer className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-0.5">Duration</p>
                   <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.duration || '8s'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-cine-accent shadow-sm">
                   <Cpu className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-0.5">Model</p>
                   <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{getModelName(item.modelId)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <FileText className="w-3 h-3" />
                  <span>Topic</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-white dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/50">
                  {item.topic}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Vibestack</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-white dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/50">
                  {item.vibestack}
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="p-5 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Generated Prompt</span>
            </div>
            
            <div className="relative group">
              <pre className="p-4 bg-zinc-100 dark:bg-[#0e0e11] border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                {item.generatedPrompt}
              </pre>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors px-4 py-2 rounded-lg shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy Prompt"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(item);
                }}
                className="flex items-center gap-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-700 transition-colors px-4 py-2 rounded-lg shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Load Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HistorySection: React.FC<HistorySectionProps> = ({ history, onRestore }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 animate-fade-in-up pb-20">
      <h3 className="text-zinc-500 dark:text-zinc-400 font-medium mb-6 flex items-center gap-2 px-1 text-sm uppercase tracking-wider">
        <Clock className="w-4 h-4" />
        Generation History
      </h3>
      <div className="space-y-4">
        {history.map((item) => (
          <HistoryCard key={item.id} item={item} onRestore={onRestore} />
        ))}
      </div>
    </div>
  );
};