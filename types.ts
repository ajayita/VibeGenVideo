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

export const DURATION_OPTIONS = ['5s', '8s', '10s', '15s'];