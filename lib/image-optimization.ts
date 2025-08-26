// Image optimization utilities for lazy loading and responsive images
import { Project } from '@/lib/supabase'

// Type for any object that might have images
interface ProjectLike {
  images?: string[]
  title?: string
  [key: string]: unknown
}

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  blur?: boolean
}

interface ResponsiveImageUrls {
  thumbnail: string    // 300px wide
  small: string       // 600px wide  
  medium: string      // 900px wide
  large: string       // 1200px wide
  original: string    // Full size
}

interface OptimizedImageData {
  src: string
  srcSet: string
  sizes: string
  placeholder: string
  aspectRatio: number | null
  alt: string
}

// Helper to check if a URL is a Supabase storage URL
function isSupabaseStorageUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // Supabase storage URLs typically end with .supabase.co
    return url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

// Generate Supabase storage transform URL
export function generateSupabaseImageUrl(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!originalUrl || !isSupabaseStorageUrl(originalUrl)) {
    return originalUrl
  }

  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options

  try {
    const url = new URL(originalUrl)
    const searchParams = new URLSearchParams()

    if (width) searchParams.set('width', width.toString())
    if (height) searchParams.set('height', height.toString())
    if (quality !== 80) searchParams.set('quality', quality.toString())
    if (format !== 'webp') searchParams.set('format', format)

    // Add transform parameters to the URL
    if (searchParams.toString()) {
      url.pathname = url.pathname.replace('/object/public/', '/object/public/transform/')
      url.search = searchParams.toString()
    }

    return url.toString()
  } catch (error) {
    console.warn('Failed to generate optimized image URL:', error)
    return originalUrl
  }
}

// Generate responsive image URLs for different breakpoints
export function generateResponsiveImageUrls(originalUrl: string): ResponsiveImageUrls {
  // Only apply transformations to Supabase URLs
  if (originalUrl.includes('/storage/v1/object/public/')) {
    return {
      thumbnail: generateSupabaseImageUrl(originalUrl, { width: 300, quality: 70 }),
      small: generateSupabaseImageUrl(originalUrl, { width: 600, quality: 75 }),
      medium: generateSupabaseImageUrl(originalUrl, { width: 900, quality: 80 }),
      large: generateSupabaseImageUrl(originalUrl, { width: 1200, quality: 85 }),
      original: originalUrl
    }
  }
  
  // For non-Supabase URLs, just return the same URL for all sizes
  return {
    thumbnail: originalUrl,
    small: originalUrl,
    medium: originalUrl,
    large: originalUrl,
    original: originalUrl
  }
}

// Generate optimized image data for Next.js Image component
export function generateOptimizedImageData(
  originalUrl: string,
  alt: string = '',
  aspectRatio: number | null = null
): OptimizedImageData {
  const responsive = generateResponsiveImageUrls(originalUrl)

  // Generate srcSet for responsive images
  const srcSet = [
    `${responsive.thumbnail} 300w`,
    `${responsive.small} 600w`,
    `${responsive.medium} 900w`,
    `${responsive.large} 1200w`
  ].join(', ')

  // Default responsive sizes
  const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  // Generate low-quality placeholder (only for Supabase URLs)
  const placeholder = originalUrl.includes('/storage/v1/object/public/') 
    ? generateSupabaseImageUrl(originalUrl, {
        width: 20,
        quality: 10,
        blur: true
      })
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRjVGNURDIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K' // Generic blur placeholder

  return {
    src: responsive.medium, // Default to medium size
    srcSet,
    sizes,
    placeholder,
    aspectRatio,
    alt
  }
}

// Optimize project images for API responses  
export function optimizeProjectImages(project: Project | ProjectLike) {
  if (!project.images || !Array.isArray(project.images)) {
    return project
  }

  const optimizedImages = project.images.map((imageUrl: string) => {
    const responsive = generateResponsiveImageUrls(imageUrl)
    const optimized = generateOptimizedImageData(imageUrl, project.title)

    return {
      original: imageUrl,
      responsive,
      optimized,
      placeholder: optimized.placeholder
    }
  })

  return {
    ...project,
    images: project.images, // Keep original for backward compatibility
    optimizedImages,
    // Add quick access to first image optimizations
    featuredImage: optimizedImages[0] || null
  }
}

// Batch optimize multiple projects
export function optimizeProjectsForResponse(projects: (Project | ProjectLike)[]) {
  return projects.map(optimizeProjectImages)
}

// Generate lazy loading configuration
export function generateLazyLoadingConfig(priority: boolean = false) {
  return {
    loading: priority ? 'eager' as const : 'lazy' as const,
    priority,
    placeholder: 'blur' as const,
    quality: 85,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

// Image preloading utility for critical images
export function preloadCriticalImages(imageUrls: string[]) {
  if (typeof window === 'undefined') return

  imageUrls.forEach(url => {
    if (url) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = generateSupabaseImageUrl(url, { width: 600, quality: 80 })
      document.head.appendChild(link)
    }
  })
}

// Intersection Observer for lazy loading animations
export function createImageIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// Utility to convert image URL to base64 placeholder
export async function generateBlurDataURL(imageUrl: string): Promise<string> {
  try {
    // Generate a very small, low-quality version for blur placeholder
    const blurUrl = generateSupabaseImageUrl(imageUrl, {
      width: 8,
      height: 8,
      quality: 1
    })

    if (typeof window === 'undefined') {
      // Server-side: return a generic blur data URL
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGREQwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K'
    }

    // Client-side: fetch and convert to base64
    const response = await fetch(blurUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch blur image: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64 = btoa(binary)
    return `data:image/webp;base64,${base64}`
  } catch (error) {
    console.warn('Failed to generate blur data URL:', error)
    // Return a generic blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGREQwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K'
  }
}