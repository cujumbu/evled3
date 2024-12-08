import type { Language } from './translations';

export interface TimerConfig {
  id: string;
  user_id: string;
  end_date: string;
  style: 'modern' | 'minimal' | 'classic' | 'neon' | 'gradient' | 'elegant';
  color: string;
  language: Language;
  created_at: string;
  views: number;
  max_views: number | null;
  active: boolean;
}