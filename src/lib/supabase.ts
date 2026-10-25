import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration is missing. Check the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY values in your .env file.',
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
