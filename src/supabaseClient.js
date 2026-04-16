import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gbigszvinyoxgzeotoqm.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY' // Get this from your Supabase settings

// This creates the client once and exports it
export const supabase = createClient(supabaseUrl, supabaseKey)