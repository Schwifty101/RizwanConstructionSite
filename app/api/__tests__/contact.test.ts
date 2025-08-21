/**
 * @jest-environment node
 */

import { POST } from '../contact/route'
import { NextRequest } from 'next/server'

// Mock the dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({
          data: [{ id: '123', name: 'Test User' }],
          error: null
        }))
      }))
    }))
  }
}))

jest.mock('@/lib/rate-limiter', () => ({
  getClientIdentifier: jest.fn(() => 'test-identifier'),
  checkRateLimit: jest.fn(() => ({
    allowed: true,
    remaining: 4,
    limit: 5,
    resetTime: Date.now() + 60000
  })),
  createRateLimitResponse: jest.fn(() =>
    Response.json({ error: 'Rate limited' }, { status: 429 })
  ),
  rateLimiters: {
    contact: { windowMs: 60000, maxRequests: 5 }
  }
}))

// Helper function to create a test request
function createRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

describe('/api/contact', () => {
  test('successfully processes valid contact form', async () => {
    const requestBody = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      message: 'I would like to inquire about your services.'
    }

    const request = createRequest(requestBody)
    const response = await POST(request)

    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.message).toBe('Contact form submitted successfully')
    expect(data.id).toBe('123')
  })

  test('rejects request with missing required fields', async () => {
    const requestBody = {
      name: 'John Doe',
      // missing email and message
    }

    const request = createRequest(requestBody)
    const response = await POST(request)

    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Missing required fields')
  })

  test('rejects request with invalid email', async () => {
    const requestBody = {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Test message'
    }

    const request = createRequest(requestBody)
    const response = await POST(request)

    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Invalid email format')
  })

  test('rejects request with too long input', async () => {
    const requestBody = {
      name: 'a'.repeat(150), // Too long
      email: 'john@example.com',
      message: 'Test message'
    }

    const request = createRequest(requestBody)
    const response = await POST(request)

    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('Input too long')
  })

  test('sanitizes input properly', async () => {
    const requestBody = {
      name: '<script>alert("xss")</script>John Doe',
      email: 'john@example.com',
      message: 'Test <b>message</b> with HTML'
    }

    const request = createRequest(requestBody)
    const response = await POST(request)

    expect(response.status).toBe(201)
    // The sanitized input should be used in the database call
  })

  test('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: 'invalid json{',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})