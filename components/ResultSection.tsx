import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface ResultSectionProps {
  result: string;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Generated Output
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-medium text-cine-accent hover:text-cine-accent-hover transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              COPIED
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              COPY PROMPT
            </>
          )}
        </button>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cine-accent to-purple-600 rounded-xl opacity-20 dark:opacity-30 blur group-hover:opacity-40 dark:group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-white dark:bg-[#0e0e11] rounded-xl p-6 border border-zinc-200 dark:border-zinc-800/50 shadow-xl dark:shadow-2xl">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
};