import { Project } from '@/lib/supabase'
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
  thumbnail: string    
  small: string       
  medium: string      
  large: string       
  original: string    
}
interface OptimizedImageData {
  src: string
  srcSet: string
  sizes: string
  placeholder: string
  aspectRatio: number | null
  alt: string
}
function isSupabaseStorageUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}
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
export function generateResponsiveImageUrls(originalUrl: string): ResponsiveImageUrls {
  if (originalUrl.includes('/storage/v1/object/public/')) {
    return {
      thumbnail: generateSupabaseImageUrl(originalUrl, { width: 300, quality: 70 }),
      small: generateSupabaseImageUrl(originalUrl, { width: 600, quality: 75 }),
      medium: generateSupabaseImageUrl(originalUrl, { width: 900, quality: 80 }),
      large: generateSupabaseImageUrl(originalUrl, { width: 1200, quality: 85 }),
      original: originalUrl
    }
  }
  return {
    thumbnail: originalUrl,
    small: originalUrl,
    medium: originalUrl,
    large: originalUrl,
    original: originalUrl
  }
}
export function generateOptimizedImageData(
  originalUrl: string,
  alt: string = '',
  aspectRatio: number | null = null
): OptimizedImageData {
  const responsive = generateResponsiveImageUrls(originalUrl)
  const srcSet = [
    `${responsive.thumbnail} 300w`,
    `${responsive.small} 600w`,
    `${responsive.medium} 900w`,
    `${responsive.large} 1200w`
  ].join(', ')
  const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  const placeholder = originalUrl.includes('/storage/v1/object/public/') 
    ? generateSupabaseImageUrl(originalUrl, {
        width: 20,
        quality: 10,
        blur: true
      })
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRjVGNURDIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K' 
  return {
    src: responsive.medium, 
    srcSet,
    sizes,
    placeholder,
    aspectRatio,
    alt
  }
}
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
    images: project.images, 
    optimizedImages,
    featuredImage: optimizedImages[0] || null
  }
}
export function optimizeProjectsForResponse(projects: (Project | ProjectLike)[]) {
  return projects.map(optimizeProjectImages)
}
export function generateLazyLoadingConfig(priority: boolean = false) {
  return {
    loading: priority ? 'eager' as const : 'lazy' as const,
    priority,
    placeholder: 'blur' as const,
    quality: 85,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}
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
export async function generateBlurDataURL(imageUrl: string): Promise<string> {
  try {
    const blurUrl = generateSupabaseImageUrl(imageUrl, {
      width: 8,
      height: 8,
      quality: 1
    })
    if (typeof window === 'undefined') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGREQwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K'
    }
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
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGREQwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K'
  }
}
