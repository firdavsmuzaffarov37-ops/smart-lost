import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zigmkgwbrhwcyuzrmxce.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_z-5gCo8zf3bqUPv1JXM-KA_KPyNsqLQ';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey.length > 10
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Test connectivity with Supabase
 */
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    return { connected: false, error: 'Supabase credentials not configured' };
  }

  try {
    // Attempt a lightweight ping or read from 'reports'
    const { data, error } = await supabase.from('reports').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet (Postgres 42P01 or PostgREST PGRST205), we know Supabase responded!
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return {
          connected: true,
          tableReady: false,
          message: "Connected to Supabase! Run supabase_schema.sql in Supabase SQL Editor to activate cloud sync.",
        };
      }
      return { connected: false, error: error.message };
    }
    return { connected: true, tableReady: true, message: 'Connected to Supabase Cloud Database' };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
