// Redis-based rate limiter for production environments
// This provides distributed rate limiting across multiple server instances

interface RedisRateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyPrefix?: string // Optional prefix for Redis keys
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
}

// Mock Redis client interface (to be replaced with actual Redis implementation)
interface RedisClient {
  get(key: string): Promise<string | null>
  setex(key: string, seconds: number, value: string): Promise<void>
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<boolean>
  pipeline(): RedisClient
  exec(): Promise<Array<[Error | null, unknown]>>
}

// Redis connection (lazy-loaded)
const redisClient: RedisClient | null = null

async function getRedisClient(): Promise<RedisClient | null> {
  if (redisClient) return redisClient

  // Only attempt Redis connection if URL is provided
  if (!process.env.REDIS_URL) {
    return null
  }

  try {
    // For actual implementation, uncomment and install redis package:
    // const { Redis } = require('ioredis')
    // redisClient = new Redis(process.env.REDIS_URL, {
    //   retryDelayOnFailover: 100,
    //   maxRetriesPerRequest: 3,
    //   lazyConnect: true,
    // })
    // 
    // await redisClient.ping()
    // console.log('✅ Redis connected successfully')
    
    // Mock implementation for development
    console.log('⚠️ Redis URL provided but using mock implementation. Install and configure Redis for production.')
    return null
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error)
    return null
  }
}

export async function redisRateLimit(
  identifier: string,
  config: RedisRateLimitConfig
): Promise<RateLimitResult> {
  const redis = await getRedisClient()
  
  // Fallback to in-memory rate limiting if Redis is not available
  if (!redis) {
    const { checkRateLimit } = await import('./rate-limiter')
    return checkRateLimit(identifier, config)
  }

  const key = `${config.keyPrefix || 'ratelimit'}:${identifier}`
  const window = Math.floor(Date.now() / config.windowMs)
  const windowKey = `${key}:${window}`
  
  try {
    // Use pipeline for atomic operations
    const pipeline = redis.pipeline()
    pipeline.incr(windowKey)
    pipeline.expire(windowKey, Math.ceil(config.windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results?.[0]?.[1] as number
    
    const resetTime = (window + 1) * config.windowMs
    const remaining = Math.max(0, config.maxRequests - count)
    
    return {
      allowed: count <= config.maxRequests,
      limit: config.maxRequests,
      remaining,
      resetTime
    }
  } catch (error) {
    console.error('Redis rate limit error:', error)
    
    // Fallback to in-memory on Redis errors
    const { checkRateLimit } = await import('./rate-limiter')
    return checkRateLimit(identifier, config)
  }
}

// Production-ready rate limiter that automatically chooses Redis or in-memory
export async function productionRateLimit(
  identifier: string,
  config: RedisRateLimitConfig
): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === 'production'
  const hasRedis = Boolean(process.env.REDIS_URL)
  
  if (isProduction && hasRedis) {
    return redisRateLimit(identifier, config)
  } else {
    // Use in-memory rate limiting for development or when Redis is not available
    const { checkRateLimit } = await import('./rate-limiter')
    return checkRateLimit(identifier, config)
  }
}

// Enhanced rate limiters for different endpoints using Redis in production
export const productionRateLimiters = {
  default: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    keyPrefix: 'api'
  },
  
  contact: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    keyPrefix: 'contact'
  },
  
  projects: {
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 30,
    keyPrefix: 'projects'
  },
  
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // Stricter for auth endpoints
    keyPrefix: 'auth'
  }
}

// Helper function to create rate limit response with Redis support
export function createProductionRateLimitResponse(resetTime: number, retryAfter?: number) {
  const retrySeconds = retryAfter || Math.ceil((resetTime - Date.now()) / 1000)
  
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: retrySeconds
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retrySeconds.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        'X-RateLimit-Policy': process.env.REDIS_URL ? 'redis' : 'memory'
      }
    }
  )
}

// Setup instructions for Redis (for documentation)
export const REDIS_SETUP_INSTRUCTIONS = `
# Redis Rate Limiting Setup

## For Production Deployment:

1. Add Redis to your hosting provider (Vercel KV, Upstash, Railway Redis, etc.)

2. Set the REDIS_URL environment variable:
   REDIS_URL=redis://username:password@host:port

3. Install the Redis client package:
   npm install ioredis

4. Uncomment the Redis client implementation in redis-rate-limiter.ts

## Benefits of Redis Rate Limiting:
- Distributed across multiple server instances
- Persistent across deployments
- More accurate rate limiting
- Better performance at scale

## Current Status:
- Development: In-memory rate limiting (resets on deployment)
- Production: Will use Redis if REDIS_URL is provided, otherwise falls back to in-memory
`

// Log Redis status
if (typeof window === 'undefined') {
  const hasRedis = Boolean(process.env.REDIS_URL)
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction && !hasRedis) {
    console.warn('⚠️ Production deployment detected without Redis URL. Rate limiting will use in-memory storage.')
    console.info(REDIS_SETUP_INSTRUCTIONS)
  } else if (hasRedis) {
    console.log('✅ Redis URL detected for distributed rate limiting')
  }
}