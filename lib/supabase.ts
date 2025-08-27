import { createClient } from '@supabase/supabase-js'
import { getEnvVar, validateEnvironmentVariables } from './env-validation'
const validation = validateEnvironmentVariables(true)
if (!validation.isValid) {
  console.error('Supabase client initialization failed due to environment validation errors:', validation.errors)
  throw new Error('Missing or invalid Supabase environment variables')
}
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: true 
  },
  global: {
    headers: {
      'x-application-name': 'rizwan-construction-website',
    },
  },
})
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
export type Project = {
  id: string
  title: string
  description?: string
  category: string
  images: string[]
  date: string
  location?: string
  slug: string
  featured: boolean
  created_at: string
  updated_at: string
}
export type Service = {
  id: string
  name: string
  description?: string
  image_url?: string
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
  details?: string[] 
}
