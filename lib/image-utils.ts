export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }
  try {
    const parsedUrl = new URL(url)
    if (!['http:', 'https:', 'blob:'].includes(parsedUrl.protocol)) {
      return false
    }
    if (parsedUrl.protocol === 'blob:') {
      return true
    }
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']
    const pathname = parsedUrl.pathname.toLowerCase()
    const hasValidExtension = validImageExtensions.some(ext => pathname.endsWith(ext))
    const isSupabaseStorage = url.includes('/storage/v1/object/public/')
    const isCloudinaryUrl = url.includes('cloudinary.com')
    const isImageHost = url.includes('images') || url.includes('img') || url.includes('photo')
    return hasValidExtension || isSupabaseStorage || isCloudinaryUrl || isImageHost
  } catch {
    return false
  }
}
export function getValidImageUrl(url: string | undefined | null, fallback?: string): string | null {
  if (!url) {
    return fallback || null
  }
  if (isValidImageUrl(url)) {
    return url
  }
  console.warn(`Invalid image URL detected: ${url}`)
  return fallback || null
}
export function validateImageArray(images: unknown): string[] {
  if (!Array.isArray(images)) {
    return []
  }
  return images
    .filter((url): url is string => typeof url === 'string' && isValidImageUrl(url))
    .slice(0, 10) 
}
export function getPlaceholderImageUrl(width = 400, height = 300, text = 'No Image'): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http:
    <rect width="100%" height="100%" fill="#f5f5dc"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#333333">${text}</text>
  </svg>`
  const base64 = btoa(svg)
  return `data:image/svg+xml;base64,${base64}`
}
export function getSafeImageUrl(
  url: string | undefined | null, 
  width = 400, 
  height = 300,
  placeholder = 'Project Image'
): string {
  const validUrl = getValidImageUrl(url)
  if (validUrl) {
    return validUrl
  }
  return getPlaceholderImageUrl(width, height, placeholder)
}
