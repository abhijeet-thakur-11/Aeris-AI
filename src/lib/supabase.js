import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://vqkadrhvzdlxfvgpttwg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_3N1eHstXHlu8vTToG9sBhQ_SuhDwqRE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
