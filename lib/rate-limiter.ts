// Simple in-memory rate limiter for API routes

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 requests per 15 minutes
}

const CONTACT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5 // 5 contact form submissions per minute
}

export function getClientIdentifier(request: Request): string {
  // In a real production app, you might want to use:
  // - User ID for authenticated requests
  // - IP address from headers (behind proxy: x-forwarded-for, x-real-ip)
  // - Combination of IP + User-Agent
  
  // For now, we'll use a simple approach
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  return `${ip}-${userAgent.substring(0, 50)}` // Truncate user agent
}

export function checkRateLimit(identifier: string, config: RateLimitConfig = DEFAULT_CONFIG): {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = `${identifier}-${Math.floor(now / config.windowMs)}`
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
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

// Specific rate limiters for different endpoints
export const rateLimiters = {
  default: DEFAULT_CONFIG,
  contact: CONTACT_CONFIG,
  // Add more as needed
  projects: {
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 30 // 30 requests per minute
  }
}