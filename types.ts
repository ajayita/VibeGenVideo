export interface PromptRequest {
  topic: string;
  vibestack: string;
  duration: string;
}

export interface PromptResponse {
  generatedPrompt: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  topic: string;
  vibestack: string;
  duration?: string;
  modelId?: string;
  generatedPrompt: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface PresetVibe {
  id: string;
  name: string;
  description: string;
  value: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  pricing: string;
  isNew?: boolean;
}

export const DURATION_OPTIONS = ['5s', '8s', '10s', '15s'];