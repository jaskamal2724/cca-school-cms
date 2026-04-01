import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const isPlaceholder = !supabaseUrl || supabaseUrl === 'your-supabase-url-here';

if (isPlaceholder || !supabaseAnonKey) {
  console.warn("Supabase credentials are not set in .env.local. Please update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

const finalUrl = isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl;
const finalKey = !supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key-here' ? 'placeholder-anon-key' : supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey)
