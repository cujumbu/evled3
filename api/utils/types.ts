import type { Language } from './translations.js';

export interface TimerConfig {
  id: string;
  user_id: string;
  end_date: string;
  timezone: string;
  style: 'modern' | 'minimal' | 'classic' | 'neon' | 'gradient' | 'elegant';
  color: string;
  language: Language;
  created_at: string;
  views: number;
  max_views: number | null;
  active: boolean;
}
