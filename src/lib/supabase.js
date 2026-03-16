import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rljivdfnekjhkfexauar.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaml2ZGZuZWtqaGtmZXhhdWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODQyODAsImV4cCI6MjA4OTE2MDI4MH0.3B1MjASxRLJosCdoI1E-Q6YYGHpI5IA218CengJFRoo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isDemo = false
