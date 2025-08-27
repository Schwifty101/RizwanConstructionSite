interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}
const store: RateLimitStore = {}
interface RateLimitConfig {
  windowMs: number 
  maxRequests: number 
}
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, 
  maxRequests: 100 
}
const CONTACT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, 
  maxRequests: 5 
}
export function getClientIdentifier(request: Request): string {
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  return `${ip}-${userAgent.substring(0, 50)}` 
}
export function checkRateLimit(identifier: string, config: RateLimitConfig = DEFAULT_CONFIG): {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = `${identifier}-${Math.floor(now / config.windowMs)}`
  if (Math.random() < 0.01) { 
    cleanupOldEntries()
  }
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs
    }
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime
    }
  }
  store[key].count++
  return {
    allowed: store[key].count <= config.maxRequests,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - store[key].count),
    resetTime: store[key].resetTime
  }
}
function cleanupOldEntries() {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}
export function createRateLimitResponse(resetTime: number) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString()
      }
    }
  )
}
export const rateLimiters = {
  default: DEFAULT_CONFIG,
  contact: CONTACT_CONFIG,
  projects: {
    windowMs: 60 * 1000, 
    maxRequests: 30 
  }
}
