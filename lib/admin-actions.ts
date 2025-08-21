'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  location: z.string().max(255).optional(),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([])
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper function to get authenticated Supabase client
async function getAuthenticatedClient() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Authentication required')
  }

  // Check admin privileges
  const isAdmin = user.user_metadata?.role === 'admin' || 
                 user.app_metadata?.role === 'admin' ||
                 user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) {
    throw new Error('Admin privileges required')
  }

  return { supabase, user }
}

// Get all projects for admin
export async function getAdminProjects() {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch projects' 
    }
  }
}

// Create new project
export async function createProject(formData: ProjectFormData) {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Validate input
    const validatedData = projectSchema.parse(formData)
    
    // Generate unique slug
    const baseSlug = generateSlug(validatedData.title)
    let slug = baseSlug
    let counter = 1
    
    // Check if slug exists and make it unique
    while (true) {
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...validatedData,
        slug,
        date: new Date(validatedData.date).toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath('/')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error creating project:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    }
  }
}

// Update existing project
export async function updateProject(id: string, formData: ProjectFormData) {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Validate input
    const validatedData = projectSchema.parse(formData)
    
    // Check if project exists
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('slug, title')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingProject) {
      throw new Error('Project not found')
    }

    // Generate new slug if title changed
    let slug = existingProject.slug
    if (existingProject.title !== validatedData.title) {
      const baseSlug = generateSlug(validatedData.title)
      slug = baseSlug
      let counter = 1
      
      // Check if new slug exists
      while (true) {
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .single()
        
        if (!existing) break
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...validatedData,
        slug,
        date: new Date(validatedData.date).toISOString().split('T')[0]
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${existingProject.slug}`)
    revalidatePath(`/portfolio/${slug}`)
    revalidatePath('/')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error updating project:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update project' 
    }
  }
}

// Delete project
export async function deleteProject(id: string) {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Get project details first for cleanup
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('slug, images')
      .eq('id', id)
      .single()
    
    if (fetchError || !project) {
      throw new Error('Project not found')
    }

    // Delete associated images from storage
    if (project.images && project.images.length > 0) {
      const imagePaths = project.images.map((url: string) => {
        // Extract file path from URL
        const parts = url.split('/')
        return parts[parts.length - 1]
      })
      
      const { error: storageError } = await supabase.storage
        .from('project-images')
        .remove(imagePaths)
      
      if (storageError) {
        console.warn('Warning: Failed to delete some images:', storageError.message)
      }
    }

    // Delete project record
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${project.slug}`)
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete project' 
    }
  }
}

// Upload image to Supabase storage
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file
    const { error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to upload image' 
    }
  }
}