import React, { useRef, useState } from 'react';
import { Film, Sparkles, PlusCircle, Timer, Download, Upload, RotateCcw, Save, X, Trash2, Cpu, Info, HelpCircle, Check } from 'lucide-react';
import { PresetVibe, DURATION_OPTIONS } from '../types';
import { AVAILABLE_MODELS } from '../assets/models';

interface InputSectionProps {
  topic: string;
  setTopic: (val: string) => void;
  vibestack: string;
  setVibestack: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
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
  selectedModel,
  setSelectedModel,
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
  const [showPresetHelp, setShowPresetHelp] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // State for new vibe form
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeDesc, setNewVibeDesc] = useState('');

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handlePresetClick = (presetValue: string) => {
    if (!vibestack.trim()) {
      setVibestack(presetValue);
    } else {
      setVibestack(`${vibestack}\n\n${presetValue}`);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(vibes, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'vibegen_presets.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showFeedback('Export complete');
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export presets.");
    }
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
            showFeedback(`Imported ${parsed.length} presets`);
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
    showFeedback("Preset saved");
  };

  const getDurationTooltip = (opt: string) => {
    if (opt === '5s') return "Best for single, high-detail moments or slow motion.";
    if (opt === '8s') return "Standard clip length for most video generators.";
    if (opt === '10s') return "Good for establishing shots with movement.";
    if (opt === '15s') return "Best for complex sequences or evolving action.";
    return "Target video duration";
  };

  const currentModelInfo = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      
      {/* Topic Input */}
      <div className="space-y-3">
        <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2" title="The core subject matter of your video">
          <Film className="w-5 h-5 text-cine-accent" />
          <span>1. The Topic</span>
        </label>
        <p className="text-sm text-zinc-500">What is happening? Describe the subject, action, and physics.</p>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., A giant astronaut walking through a field of crystalline flowers on Mars..."
          title="Enter the main scene description here. Who, what, where?"
          className="w-full h-32 bg-white dark:bg-cine-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cine-accent transition-all resize-none font-sans shadow-sm dark:shadow-none"
        />
      </div>

      {/* Vibestack Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between relative">
          <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2" title="Technical and stylistic modifiers">
            <Sparkles className="w-5 h-5 text-cine-accent" />
            <span>2. The Vibestack</span>
          </label>

          <div className="flex items-center gap-3">
            {/* Feedback Message */}
            {feedbackMessage && (
               <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-medium rounded-full animate-fade-in border border-green-200 dark:border-green-800/30">
                 <Check className="w-3 h-3" />
                 {feedbackMessage}
               </div>
            )}

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
                title="Import Presets from JSON file"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button 
                onClick={handleExport}
                className="p-1.5 text-zinc-500 hover:text-cine-accent transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Export your current Presets to JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={onResetVibes}
                className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Reset all Presets to default factory settings"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
              <button 
                onClick={() => setShowPresetHelp(!showPresetHelp)}
                className={`p-1.5 transition-colors rounded-md ${showPresetHelp ? 'bg-cine-accent text-white' : 'text-zinc-500 hover:text-cine-accent hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Learn how to manage Presets"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Help Popover */}
          {showPresetHelp && (
            <div className="absolute right-0 top-full mt-2 z-20 w-80 p-5 bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                   <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Managing Presets</h4>
                   <button onClick={() => setShowPresetHelp(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="w-3 h-3" /></button>
                </div>
                
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                  <li><strong>Save:</strong> Click the "Save as Preset" button below to save the current text as a reusable chip.</li>
                  <li><strong>Export:</strong> Download all your custom presets to a JSON file for backup or sharing.</li>
                  <li><strong>Import:</strong> Upload a JSON file to add new presets.</li>
                </ul>

                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-mono text-zinc-500 mb-1">Expected JSON Format:</p>
                  <pre className="font-mono text-[10px] text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre">
{`[
  {
    "id": "unique-string",
    "name": "Display Name",
    "value": "Prompt content..."
  }
]`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-zinc-500">Cinematography, aesthetics, lighting, and camera gear.</p>
        
        {/* Presets List */}
        <div className="flex flex-wrap gap-2 mb-2">
          {vibes.map((preset) => (
            <div key={preset.id} className="group relative">
               <button
                onClick={() => handlePresetClick(preset.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-cine-accent/50 dark:hover:border-cine-accent/50 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-left pr-6"
                title={`Apply preset: ${preset.description}`}
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
            title="Save the current vibestack text as a new preset button"
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
                title="The name that will appear on the button"
              />
              <input 
                type="text" 
                placeholder="Short Description" 
                value={newVibeDesc}
                onChange={(e) => setNewVibeDesc(e.target.value)}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cine-accent"
                title="Tooltip description for this preset"
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
          title="Define camera gear, lighting, color grading, and style"
          className="w-full h-32 bg-white dark:bg-cine-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cine-accent transition-all resize-none font-sans shadow-sm dark:shadow-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Duration Input */}
        <div className="space-y-3">
          <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2" title="How long should the generated video clip be?">
            <Timer className="w-5 h-5 text-cine-accent" />
            <span>3. Duration</span>
          </label>
          <p className="text-sm text-zinc-500">Target length.</p>
          
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((opt) => (
               <button
                 key={opt}
                 onClick={() => setDuration(opt)}
                 title={getDurationTooltip(opt)}
                 className={`
                   py-2.5 rounded-lg border text-sm font-medium transition-all
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

        {/* Model Selection */}
        <div className="space-y-3">
           <label className="flex items-center text-zinc-700 dark:text-zinc-300 font-semibold text-lg gap-2" title="Select the AI model used to generate the prompt">
             <Cpu className="w-5 h-5 text-cine-accent" />
             <span>4. Model</span>
           </label>
           <p className="text-sm text-zinc-500 flex items-center gap-1">
             AI Engine & Cost
           </p>
           
           <div className="relative">
             <select
               value={selectedModel}
               onChange={(e) => setSelectedModel(e.target.value)}
               title="Choose between speed (Flash) or reasoning power (Pro)"
               className="w-full appearance-none bg-white dark:bg-cine-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 pl-4 pr-10 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-cine-accent transition-all shadow-sm"
             >
               {AVAILABLE_MODELS.map((model) => (
                 <option key={model.id} value={model.id}>
                   {model.name}
                 </option>
               ))}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
               <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                 <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
               </svg>
             </div>
           </div>
           
           {/* Pricing Info Display */}
           {currentModelInfo && (
             <div className="flex items-start gap-2 text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/50">
               <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-cine-accent" />
               <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Pricing: {currentModelInfo.pricing}
                  </span>
                  <span className="opacity-80 leading-tight">
                    {currentModelInfo.description}
                  </span>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !topic.trim() || !vibestack.trim()}
        title={!topic.trim() || !vibestack.trim() ? "Please enter a topic and vibestack to generate" : "Generate your cinematic prompt"}
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