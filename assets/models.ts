import { ModelOption } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3.0 Pro',
    description: 'Top-tier reasoning engine. Best for complex art styles, heavy narrative constraints, and synthesizing abstract concepts into concrete visual descriptions.',
    pricing: 'Free (Preview)',
    isNew: true
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.0 Flash',
    description: 'Next-generation efficiency. Delivers near-Pro quality with significantly lower latency. Perfect for rapid iteration and general cinematic prompting.',
    pricing: 'Free (Preview)',
    isNew: true
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini 2.5 Flash',
    description: 'The reliable production workhorse. Offers a great balance of speed, cost, and instruction adherence. Best for standard video generation workflows.',
    pricing: '~$0.30 / 1M output tokens'
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini 2.5 Flash Lite',
    description: 'The most cost-effective option. Extremely fast and lightweight. Ideal for high-volume generation, simple scenes, or quick experiments.',
    pricing: '~$0.15 / 1M output tokens'
  }
];

export const DEFAULT_MODEL_ID = 'gemini-flash-lite-latest';