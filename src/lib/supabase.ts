import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Real-time sync will not work until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are added to .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
