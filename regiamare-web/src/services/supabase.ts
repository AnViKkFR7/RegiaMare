import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
}

// Export configuration for debugging
export const config = {
  url: supabaseUrl,
  isConfigured: isSupabaseConfigured()
};

