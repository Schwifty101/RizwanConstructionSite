import { createClient } from '@supabase/supabase-js'
import { getEnvVar, validateEnvironmentVariables } from './env-validation'

// Validate environment variables
const validation = validateEnvironmentVariables(true)
if (!validation.isValid) {
  console.error('Supabase client initialization failed due to environment validation errors:', validation.errors)
  throw new Error('Missing or invalid Supabase environment variables')
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth for static generation
  },
  global: {
    headers: {
      'x-application-name': 'rizwan-construction-website',
    },
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export type Project = {
  id: string
  title: string
  description: string
  category: string
  images: string[]
  date: string
  location: string
  slug: string
  featured: boolean
  created_at: string
  updated_at: string
}

export type Service = {
  id: string
  name: string
  description: string
  image_url: string
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export type Contact = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: string
  timestamp: string
}