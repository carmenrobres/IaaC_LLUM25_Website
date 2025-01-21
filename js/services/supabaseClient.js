const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

// /js/services/supabaseClient.js
// Correct import
import { createClient } from '@supabase/supabase-js';



export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
