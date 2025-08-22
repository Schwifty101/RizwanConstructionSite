/**
 * Image staging utilities for client-side preview and deferred upload
 */

import { createBrowserClient } from '@supabase/ssr'
import { API_LIMITS } from './constants'

// Create authenticated Supabase client for storage operations
function getAuthenticatedSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }
  
  // Use SSR client for proper session management in client components
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Types for staged images
export interface StagedImage {
  id: string
  file?: File  // For new files to be uploaded
  url: string  // For existing images (from DB) or object URLs for new files
  isExisting: boolean  // Whether this is an existing image from DB
  originalUrl?: string  // Original URL for existing images (for cleanup)
}

export interface ImageUploadProgress {
  imageId: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

// Constants
export const ACCEPTED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_IMAGES_PER_PROJECT = API_LIMITS.MAX_IMAGES_PER_PROJECT || 4

// Validation
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload JPG, PNG, or WebP images only.' 
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB` 
    }
  }

  return { valid: true }
}

// Generate unique ID for staged images
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Create staged image from File
export function createStagedImageFromFile(file: File): StagedImage {
  const id = generateImageId()
  return {
    id,
    file,
    url: URL.createObjectURL(file),
    isExisting: false
  }
}

// Create staged image from existing URL
export function createStagedImageFromUrl(url: string, id?: string): StagedImage {
  return {
    id: id || generateImageId(),
    url,
    isExisting: true,
    originalUrl: url
  }
}

// Clean up object URLs to prevent memory leaks
export function cleanupObjectUrls(stagedImages: StagedImage[]): void {
  stagedImages.forEach(image => {
    if (!image.isExisting && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url)
    }
  })
}

// Generate file path for upload
export function generateFilePath(projectId: string, file: File): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 9)
  const fileExt = file.name.split('.').pop()
  return `${projectId}/${timestamp}-${randomId}.${fileExt}`
}

// Upload staged images to Supabase Storage
export async function uploadStagedImages(
  projectId: string,
  stagedImages: StagedImage[],
  onProgress?: (progress: ImageUploadProgress) => void
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  const uploadPromises: Promise<{ success: boolean; url?: string; error?: string; imageId: string }>[] = []
  const finalUrls: string[] = []
  const errors: string[] = []

  // Process each staged image
  for (const image of stagedImages) {
    if (image.isExisting) {
      // Keep existing images as-is
      finalUrls.push(image.url)
      continue
    }

    if (!image.file) {
      errors.push(`No file data for image ${image.id}`)
      continue
    }

    // Upload new files
    const uploadPromise = uploadSingleImage(projectId, image.file, image.id, onProgress)
    uploadPromises.push(uploadPromise)
  }

  // Wait for all uploads to complete
  const uploadResults = await Promise.all(uploadPromises)

  // Process results in order
  let uploadIndex = 0
  for (const image of stagedImages) {
    if (image.isExisting) {
      continue // Already added to finalUrls above
    }

    const result = uploadResults[uploadIndex]
    if (result.success && result.url) {
      finalUrls.push(result.url)
    } else {
      errors.push(result.error || `Failed to upload image ${image.id}`)
    }
    uploadIndex++
  }

  return {
    success: errors.length === 0,
    urls: errors.length === 0 ? finalUrls : undefined,
    errors: errors.length > 0 ? errors : undefined
  }
}

// Upload a single image file
async function uploadSingleImage(
  projectId: string,
  file: File,
  imageId: string,
  onProgress?: (progress: ImageUploadProgress) => void
): Promise<{ success: boolean; url?: string; error?: string; imageId: string }> {
  try {
    onProgress?.({ imageId, progress: 0, status: 'uploading' })

    const filePath = generateFilePath(projectId, file)
    const supabase = getAuthenticatedSupabaseClient()

    // Check if user is authenticated before upload
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      const errorMsg = 'Authentication required for file upload'
      onProgress?.({ imageId, progress: 0, status: 'error', error: errorMsg })
      return { success: false, error: errorMsg, imageId }
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      onProgress?.({ imageId, progress: 0, status: 'error', error: uploadError.message })
      return { success: false, error: uploadError.message, imageId }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    onProgress?.({ imageId, progress: 100, status: 'completed' })
    return { success: true, url: publicUrl, imageId }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    onProgress?.({ imageId, progress: 0, status: 'error', error: errorMessage })
    return { success: false, error: errorMessage, imageId }
  }
}

// Delete images from storage (for cleanup when removing images)
export async function deleteImagesFromStorage(urls: string[]): Promise<{ success: boolean; errors?: string[] }> {
  if (urls.length === 0) return { success: true }

  const errors: string[] = []
  const filePaths: string[] = []

  // Extract file paths from URLs
  for (const url of urls) {
    try {
      const urlParts = new URL(url).pathname.split('/')
      const pathIndex = urlParts.findIndex(part => part === 'project-images')
      if (pathIndex >= 0 && pathIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(pathIndex + 1).join('/')
        filePaths.push(filePath)
      }
    } catch {
      errors.push(`Invalid URL format: ${url}`)
    }
  }

  if (filePaths.length === 0) {
    return { success: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
  }

  try {
    const supabase = getAuthenticatedSupabaseClient()
    const { error: deleteError } = await supabase.storage
      .from('project-images')
      .remove(filePaths)

    if (deleteError) {
      errors.push(deleteError.message)
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown deletion error')
  }

  return { success: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

// Helper to compare image arrays and determine what needs to be deleted
export function getImagesToDelete(originalUrls: string[], newUrls: string[]): string[] {
  return originalUrls.filter(url => !newUrls.includes(url))
}

// Helper to reorder staged images
export function reorderStagedImages(images: StagedImage[], fromIndex: number, toIndex: number): StagedImage[] {
  const newImages = [...images]
  const [removed] = newImages.splice(fromIndex, 1)
  newImages.splice(toIndex, 0, removed)
  return newImages
}