import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface TimerConfig {
  id: string;
  user_id: string;
  end_date: string;
  style: 'modern' | 'minimal' | 'classic' | 'neon' | 'gradient' | 'elegant';
  color: string;
  created_at: string;
  views: number;
  max_views: number | null;
  active: boolean;
}

export async function createTimer(config: Omit<TimerConfig, 'id' | 'created_at' | 'views' | 'active'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated when creating timer');
  }

  const timerData = {
    ...config,
    user_id: user.id,
    created_at: new Date().toISOString(),
    views: 0,
    max_views: null,
    active: true
  };

  const { data, error } = await supabase
    .from('timers')
    .insert(timerData)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating timer:', error);
    throw error;
  }

  return data;
}

export async function getUserTimers() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('timers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}