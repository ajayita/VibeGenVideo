import React, { useRef, useState } from 'react';
import { Film, Sparkles, PlusCircle, Timer, Download, Upload, RotateCcw, Save, X, Trash2 } from 'lucide-react';
import { PresetVibe, DURATION_OPTIONS } from '../types';

interface InputSectionProps {
  topic: string;
  setTopic: (val: string) => void;
  vibestack: string;
  setVibestack: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  vibes: PresetVibe[];
  onAddVibe: (vibe: PresetVibe) => void;
  onDeleteVibe: (id: string) => void;
  onResetVibes: () => void;
  onImportVibes: (vibes: PresetVibe[]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  topic,
  setTopic,
  vibestack,
  setVibestack,
  duration,
  setDuration,
  onGenerate,
  isLoading,
  vibes,
  onAddVibe,
  onDeleteVibe,
  onResetVibes,
  onImportVibes
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // State for new vibe form
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeDesc, setNewVibeDesc] = useState('');

  const handlePresetClick = (presetValue: string) => {
    if (!vibestack.trim()) {
      setVibestack(presetValue);
    } else {
      setVibestack(`${vibestack}\n\n${presetValue}`);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(vibes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'vibegen_presets.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          // Simple validation check
          const valid = parsed.every(p => p.id && p.name && p.value);
          if (valid) {
            onImportVibes(parsed);
          } else {
            alert("Invalid JSON format. Expected an array of vibe objects.");
          }
        }
      } catch (err) {
        console.error("Error parsing JSON", err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleSaveNewVibe = () => {
    if (!newVibeName.trim()) {
      alert("Please enter a name for your preset.");
      return;
    }
    if (!vibestack.trim()) {
      alert("The vibestack input is empty. Please enter some text to save as a preset.");
      return;
    }

    const newVibe: PresetVibe = {
      id: crypto.randomUUID(),
      name: newVibeName.trim(),
      description: newVibeDesc.trim() || 'Custom user preset',
      value: vibestack.trim()
    };

    onAddVibe(newVibe);
    setNewVibeName('');
    setNewVibeDesc('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      
      {/* Topic Input */}
      <div className="space-y-3">
        <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2">
          <Film className="w-5 h-5 text-cine-accent" />
          <span>1. The Topic</span>
        </label>
        <p className="text-sm text-zinc-500">What is happening? Describe the subject, action, and physics.</p>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., A giant astronaut walking through a field of crystalline flowers on Mars..."
          className="w-full h-32 bg-white dark:bg-cine-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cine-accent transition-all resize-none font-sans shadow-sm dark:shadow-none"
        />
      </div>

      {/* Vibestack Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2">
            <Sparkles className="w-5 h-5 text-cine-accent" />
            <span>2. The Vibestack</span>
          </label>

          {/* Preset Actions Toolbar */}
          <div className="flex items-center gap-1">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".json" 
            />
            <button 
              onClick={handleImportClick}
              className="p-1.5 text-zinc-500 hover:text-cine-accent transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Import Presets (JSON)"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button 
              onClick={handleExport}
              className="p-1.5 text-zinc-500 hover:text-cine-accent transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Export Presets (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={onResetVibes}
              className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-zinc-500">Cinematography, aesthetics, lighting, and camera gear.</p>
        
        {/* Presets List */}
        <div className="flex flex-wrap gap-2 mb-2">
          {vibes.map((preset) => (
            <div key={preset.id} className="group relative">
               <button
                onClick={() => handlePresetClick(preset.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-cine-accent/50 dark:hover:border-cine-accent/50 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-left pr-6"
                title={preset.description}
              >
                <PlusCircle className="w-3 h-3 flex-shrink-0" />
                <span>{preset.name}</span>
              </button>
              {/* Delete button (hidden by default, shown on hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete preset "${preset.name}"?`)) {
                    onDeleteVibe(preset.id);
                  }
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"
                title="Delete preset"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border border-dashed rounded-lg text-xs transition-colors ${isAdding ? 'bg-cine-accent/10 border-cine-accent text-cine-accent' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-cine-accent hover:border-cine-accent'}`}
          >
            {isAdding ? <X className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isAdding ? "Cancel" : "Save as Preset"}</span>
          </button>
        </div>

        {/* Add Preset Form */}
        {isAdding && (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3 animate-fade-in-down">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Create New Preset</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Preset Name (e.g. Vintage Horror)" 
                value={newVibeName}
                onChange={(e) => setNewVibeName(e.target.value)}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cine-accent"
              />
              <input 
                type="text" 
                placeholder="Short Description" 
                value={newVibeDesc}
                onChange={(e) => setNewVibeDesc(e.target.value)}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cine-accent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
               <button 
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
               >
                 Cancel
               </button>
               <button 
                onClick={handleSaveNewVibe}
                className="px-3 py-1.5 bg-cine-accent text-white rounded-lg text-xs font-medium hover:bg-cine-accent-hover"
               >
                 Save Preset
               </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              * The current text in the Vibestack box will be saved as the preset value.
            </p>
          </div>
        )}

        <textarea
          value={vibestack}
          onChange={(e) => setVibestack(e.target.value)}
          placeholder="e.g., Shot on 35mm film, anamorphic lens, blade runner style lighting, heavy grain, cinematic slow motion..."
          className="w-full h-32 bg-white dark:bg-cine-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cine-accent transition-all resize-none font-sans shadow-sm dark:shadow-none"
        />
      </div>

      {/* Duration Input */}
      <div className="space-y-3">
        <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2">
          <Timer className="w-5 h-5 text-cine-accent" />
          <span>3. Duration</span>
        </label>
        <p className="text-sm text-zinc-500">Target length for the AI video generator.</p>
        
        <div className="grid grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((opt) => (
             <button
               key={opt}
               onClick={() => setDuration(opt)}
               className={`
                 py-3 rounded-xl border text-sm font-medium transition-all
                 ${duration === opt 
                   ? 'bg-cine-accent text-white border-cine-accent shadow-md' 
                   : 'bg-white dark:bg-cine-card border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-cine-accent/50'
                 }
               `}
             >
               {opt}
             </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !topic.trim() || !vibestack.trim()}
        className={`
          w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-lg dark:shadow-none mt-4
          ${isLoading 
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cine-accent to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform hover:scale-[1.01] active:scale-[0.99]'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
            Synthesizing Prompt...
          </span>
        ) : (
          "GENERATE PROMPT"
        )}
      </button>
    </div>
  );
};