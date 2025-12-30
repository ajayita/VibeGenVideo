import React, { useState } from 'react';
import { BookOpen, Code, Zap, Aperture, Info, ChevronDown, ChevronUp, Github } from 'lucide-react';

export const InfoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-4 animate-fade-in">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
        title="Click to learn how VibeGen works and view the tutorial"
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-cine-accent text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-cine-accent'}`}>
            <Info className="w-4 h-4" />
          </div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">How VibeGen Works</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 p-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-fade-in-down space-y-8 shadow-sm">
          
          <div className="grid grid-cols-1 gap-8">
            {/* About Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                <Aperture className="w-4 h-4 text-cine-accent" />
                What is VibeGen?
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                VibeGen Architect is a prompt engineering engine designed specifically for the new wave of high-fidelity video AI models like <strong>Sora, Runway Gen-3, and Pika</strong>.
                It fuses your core <strong>Topic</strong> (the subject) with a curated <strong>Vibestack</strong> (cinematography, lighting, film stock) to generate dense, production-ready prompts.
              </p>
            </div>

            {/* How it Works Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                <Zap className="w-4 h-4 text-cine-accent" />
                Under the Hood
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                This application leverages the latest <strong>Google Gemini API</strong> (including Gemini 3.0 Pro & Flash). 
                It utilizes a specialized <strong>Master Prompt Template</strong> (visible in our open-source code) to instruct the LLM to act as a Director of Photography, ensuring camera movements match the scene's emotional tone and the clip's duration.
              </p>
            </div>
          </div>

          {/* Tutorial Steps */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-cine-accent" />
              Workflow Guide
            </h3>
            <div className="space-y-4">
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 text-xs mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">Define the Subject</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Describe the physical reality of the scene. Who is there? What are they doing? Where is it? Be specific about the action.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 text-xs mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">Apply a Vibestack</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Choose a preset (like "Analog 16mm") or write your own camera rules. This layer controls the aesthetics, color grading, and mood.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500 text-xs mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">Generate & Create</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Click Generate. Copy the resulting paragraph and paste it directly into your video generation tool. Adjust the duration to change the pacing.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Tech Stack Mini Footer */}
          <div className="bg-zinc-50 dark:bg-black/40 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-1 text-xs">
                <Code className="w-3 h-3 text-zinc-500" />
                Built With
              </h4>
              <p className="text-[10px] text-zinc-500">
                React 18 &bull; TypeScript &bull; Tailwind &bull; Google GenAI SDK
              </p>
            </div>

            <a 
              href="https://github.com/ajayita/VibeGenVideo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md transition-colors text-xs font-medium text-zinc-700 dark:text-zinc-300"
              title="View Source Code on GitHub"
            >
              <Github className="w-3 h-3" />
              Open Source
            </a>
          </div>
          
        </div>
      )}
    </div>
  );
};
