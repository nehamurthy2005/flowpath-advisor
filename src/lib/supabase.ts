import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use environment variables with fallback to known values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kupffawczbulejoushyg.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cGZmYXdjemJ1bGVqb3VzaHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDU4OTAsImV4cCI6MjA3NzkyMTg5MH0.AoNsBZreOioXQX0B5xSg2efXkR_38wMnErgo3rLJgBk';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});