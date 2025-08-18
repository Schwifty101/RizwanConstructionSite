import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from '../rate-limiter'

// Mock request for testing
function createMockRequest(headers: Record<string, string> = {}) {
  return {
    headers: {
      get: jest.fn((key: string) => headers[key] || null)
    }
  } as Request
}

describe('getClientIdentifier', () => {
  test('creates identifier from IP and user agent', () => {
    const request = createMockRequest({
      'x-forwarded-for': '192.168.1.1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    const identifier = getClientIdentifier(request)
    expect(identifier).toContain('192.168.1.1')
    expect(identifier).toContain('Mozilla/5.0')
  })

  test('handles missing headers', () => {
    const request = createMockRequest({})
    const identifier = getClientIdentifier(request)
    expect(identifier).toContain('unknown')
  })

  test('truncates long user agent', () => {
    const longUserAgent = 'a'.repeat(100)
    const request = createMockRequest({
      'user-agent': longUserAgent
    })

    const identifier = getClientIdentifier(request)
    // Should be truncated to 50 characters plus IP
    expect(identifier.length).toBeLessThan(longUserAgent.length + 20)
  })
})

describe('checkRateLimit', () => {
  test('allows first request', () => {
    const identifier = 'test-user-1'
    const config = { windowMs: 60000, maxRequests: 5 }
    
    const result = checkRateLimit(identifier, config)
    
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
    expect(result.limit).toBe(5)
  })

  test('tracks request count correctly', () => {
    const identifier = 'test-user-2'
    const config = { windowMs: 60000, maxRequests: 3 }
    
    // First request
    let result = checkRateLimit(identifier, config)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
    
    // Second request
    result = checkRateLimit(identifier, config)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(1)
    
    // Third request
    result = checkRateLimit(identifier, config)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0)
    
    // Fourth request - should be blocked
    result = checkRateLimit(identifier, config)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  test('different identifiers have separate limits', () => {
    const config = { windowMs: 60000, maxRequests: 2 }
    
    const result1 = checkRateLimit('user-1', config)
    const result2 = checkRateLimit('user-2', config)
    
    expect(result1.allowed).toBe(true)
    expect(result2.allowed).toBe(true)
    expect(result1.remaining).toBe(1)
    expect(result2.remaining).toBe(1)
  })

  test('provides correct reset time', () => {
    const identifier = 'test-user-3'
    const config = { windowMs: 60000, maxRequests: 5 }
    
    const beforeTime = Date.now()
    const result = checkRateLimit(identifier, config)
    const afterTime = Date.now()
    
    expect(result.resetTime).toBeGreaterThan(beforeTime + config.windowMs - 1000)
    expect(result.resetTime).toBeLessThan(afterTime + config.windowMs + 1000)
  })
})

describe('createRateLimitResponse', () => {
  test('creates proper rate limit response', () => {
    const resetTime = Date.now() + 60000
    const response = createRateLimitResponse(resetTime)
    
    expect(response.status).toBe(429)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(response.headers.get('Retry-After')).toBeTruthy()
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })

  test('includes correct retry-after header', async () => {
    const resetTime = Date.now() + 30000 // 30 seconds from now
    const response = createRateLimitResponse(resetTime)
    
    const retryAfter = parseInt(response.headers.get('Retry-After') || '0')
    expect(retryAfter).toBeGreaterThan(25) // Should be around 30 seconds
    expect(retryAfter).toBeLessThan(35)
  })

  test('includes proper error message', async () => {
    const resetTime = Date.now() + 60000
    const response = createRateLimitResponse(resetTime)
    
    const body = await response.json()
    expect(body.error).toBe('Too many requests')
    expect(body.message).toBe('Rate limit exceeded. Please try again later.')
  })
})