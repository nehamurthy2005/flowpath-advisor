import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const createSupabaseClient = (): SupabaseClient<Database> => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    // Return a mock client that won't crash the app
    // This allows the app to load even if env vars are temporarily unavailable
    console.warn('Supabase environment variables not yet available, using fallback');
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

export const supabase = createSupabaseClient();