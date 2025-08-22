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
    
    // Limit images to maximum 4
    const limitedImages = validatedData.images.slice(0, 4)
    
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
        images: limitedImages,
        date: new Date(validatedData.date).toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) throw error

    // Organize uploaded images into project folder
    if (limitedImages.length > 0) {
      const organizeResult = await organizeProjectImages(data.id, limitedImages)
      if (organizeResult.success && organizeResult.urls) {
        // Update project with organized image URLs
        await supabase
          .from('projects')
          .update({ images: organizeResult.urls })
          .eq('id', data.id)
        
        data.images = organizeResult.urls
      }
    }

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
    
    // Limit images to maximum 4
    const limitedImages = validatedData.images.slice(0, 4)
    
    // Check if project exists
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('slug, title, images')
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

    // Organize new images if any were added
    let finalImages = limitedImages
    if (limitedImages.length > 0) {
      const organizeResult = await organizeProjectImages(id, limitedImages)
      if (organizeResult.success && organizeResult.urls) {
        finalImages = organizeResult.urls
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...validatedData,
        slug,
        images: finalImages,
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

    // Delete associated images from storage using new organized deletion
    if (project.images && project.images.length > 0) {
      const deleteResult = await deleteProjectImages(id, project.images)
      if (!deleteResult.success) {
        console.warn('Warning: Failed to delete project images:', deleteResult.error)
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

// Upload image to Supabase storage with dedicated project folders
export async function uploadProjectImage(file: File, projectId?: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 50MB' }
    }

    // Generate project folder path with more unique identifiers
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    const microTimestamp = performance.now().toString().replace('.', '')
    const fileExt = file.name.split('.').pop()
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').split('.')[0]
    
    // Use existing project ID or generate temporary ID for new projects
    const folderId = projectId || `temp-${timestamp}-${randomId}`
    const fileName = `${folderId}/${timestamp}-${microTimestamp}-${sanitizedOriginalName}-${randomId}.${fileExt}`

    // Upload file to dedicated project folder
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

// Legacy function for backward compatibility
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadProjectImage(file)
}

// Move uploaded images to proper project folder after project creation
export async function organizeProjectImages(projectId: string, imageUrls: string[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    const organizedUrls: string[] = []
    
    for (const url of imageUrls) {
      // Extract filename from URL
      const urlParts = url.split('/')
      const currentFileName = urlParts[urlParts.length - 1]
      
      // Check if it's already in a proper project folder
      if (currentFileName.includes('/') && !currentFileName.startsWith('temp-')) {
        organizedUrls.push(url)
        continue
      }
      
      // Generate new organized path with unique identifiers
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2)
      const microTimestamp = performance.now().toString().replace('.', '')
      const fileExt = currentFileName.split('.').pop()
      const newFileName = `${projectId}/${timestamp}-${microTimestamp}-${randomId}.${fileExt}`
      
      // Move file to organized folder
      const { error: moveError } = await supabase.storage
        .from('project-images')
        .move(currentFileName, newFileName)
      
      if (moveError) {
        console.warn(`Failed to move ${currentFileName}:`, moveError)
        organizedUrls.push(url) // Keep original URL if move fails
      } else {
        // Get new public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(newFileName)
        organizedUrls.push(publicUrl)
      }
    }
    
    return { success: true, urls: organizedUrls }
  } catch (error) {
    console.error('Error organizing images:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to organize images' 
    }
  }
}

// Delete project folder and all images
export async function deleteProjectImages(projectId: string, imageUrls: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await getAuthenticatedClient()
    
    // Extract file paths from URLs
    const filePaths = imageUrls.map((url: string) => {
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      // Check if it includes folder structure
      if (url.includes(`/${projectId}/`)) {
        return `${projectId}/${fileName}`
      }
      return fileName
    })
    
    if (filePaths.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('project-images')
        .remove(filePaths)
      
      if (deleteError) {
        console.warn('Warning: Failed to delete some images:', deleteError.message)
      }
    }
    
    // Try to remove the project folder (will only work if empty)
    try {
      await supabase.storage
        .from('project-images')
        .remove([`${projectId}/`])
    } catch {
      // Ignore folder deletion errors
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting project images:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete images' 
    }
  }
}