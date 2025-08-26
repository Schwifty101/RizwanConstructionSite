import { createClient } from '@supabase/supabase-js'
import { getEnvVar, validateEnvironmentVariables } from './env-validation'

// Validate environment variables
const validation = validateEnvironmentVariables(false)
if (!validation.isValid) {
  console.error('Supabase admin client initialization failed due to environment validation errors:', validation.errors)
  throw new Error('Missing or invalid Supabase environment variables')
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')

// Create Supabase admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'x-application-name': 'rizwan-construction-admin',
    },
  },
})

// Helper function to check if admin service is properly configured
export const isAdminConfigured = () => {
  return Boolean(supabaseUrl && supabaseServiceKey)
}

// Helper function to verify admin user
export async function verifyAdminUser(email: string): Promise<boolean> {
  try {
    const adminEmail = getEnvVar('ADMIN_EMAIL')
    return email === adminEmail
  } catch {
    return false
  }
}

// Helper function to get user from session token
export async function getUserFromToken(token: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error) throw error
    return data.user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// Admin-specific operations that bypass RLS
export const adminOperations = {
  // Projects
  async getProjects() {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createProject(project: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([project])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProject(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteProject(id: string) {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Services
  async getServices() {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createService(service: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([service])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateService(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteService(id: string) {
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Storage operations
  async uploadFile(bucket: string, path: string, file: Buffer, options?: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, options)
    
    if (error) throw error
    return data
  },

  async deleteFile(bucket: string, paths: string[]) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .remove(paths)
    
    if (error) throw error
    return data
  },

  async moveFile(bucket: string, fromPath: string, toPath: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .move(fromPath, toPath)
    
    if (error) throw error
    return data
  }
}