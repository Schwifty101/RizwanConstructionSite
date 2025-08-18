import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeUrl } from '../sanitize'

describe('sanitizeInput', () => {
  test('removes HTML tags', () => {
    const input = '<script>alert("xss")</script>Hello World'
    const result = sanitizeInput(input)
    expect(result).toBe('alert("xss")Hello World')
  })

  test('removes javascript URLs', () => {
    const input = 'javascript:alert("xss")'
    const result = sanitizeInput(input)
    expect(result).toBe('alert("xss")')
  })

  test('removes event handlers', () => {
    const input = 'onclick=alert("xss") Hello'
    const result = sanitizeInput(input)
    expect(result).toBe('alert("xss") Hello')
  })

  test('removes data URIs', () => {
    const input = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk8L3NjcmlwdD4='
    const result = sanitizeInput(input)
    expect(result).toBe('')
  })

  test('trims whitespace', () => {
    const input = '  Hello World  '
    const result = sanitizeInput(input)
    expect(result).toBe('Hello World')
  })

  test('limits length', () => {
    const input = 'a'.repeat(3000)
    const result = sanitizeInput(input, 100)
    expect(result.length).toBe(100)
  })

  test('handles empty or null input', () => {
    expect(sanitizeInput('')).toBe('')
    expect(sanitizeInput(null as unknown as string)).toBe('')
    expect(sanitizeInput(undefined as unknown as string)).toBe('')
  })

  test('removes control characters', () => {
    const input = 'Hello\x00\x01\x02World'
    const result = sanitizeInput(input)
    expect(result).toBe('HelloWorld')
  })
})

describe('sanitizeEmail', () => {
  test('converts to lowercase', () => {
    const input = 'TEST@EXAMPLE.COM'
    const result = sanitizeEmail(input)
    expect(result).toBe('test@example.com')
  })

  test('removes dangerous characters', () => {
    const input = 'test<script>@example.com'
    const result = sanitizeEmail(input)
    expect(result).toBe('testscript@example.com')
  })

  test('trims whitespace', () => {
    const input = '  test@example.com  '
    const result = sanitizeEmail(input)
    expect(result).toBe('test@example.com')
  })

  test('limits length', () => {
    const input = 'a'.repeat(300) + '@example.com'
    const result = sanitizeEmail(input)
    expect(result.length).toBeLessThanOrEqual(255)
  })
})

describe('sanitizePhone', () => {
  test('keeps only valid phone characters', () => {
    const input = '+1 (555) 123-4567<script>'
    const result = sanitizePhone(input)
    expect(result).toBe('+1 (555) 123-4567')
  })

  test('removes dangerous characters', () => {
    const input = '555<script>123</script>4567'
    const result = sanitizePhone(input)
    expect(result).toBe('5551234567')
  })

  test('trims whitespace', () => {
    const input = '  555-123-4567  '
    const result = sanitizePhone(input)
    expect(result).toBe('555-123-4567')
  })
})

describe('sanitizeUrl', () => {
  test('allows valid HTTPS URLs', () => {
    const input = 'https://example.com/image.jpg'
    const result = sanitizeUrl(input)
    expect(result).toBe('https://example.com/image.jpg')
  })

  test('allows valid HTTP URLs', () => {
    const input = 'http://example.com/image.jpg'
    const result = sanitizeUrl(input)
    expect(result).toBe('http://example.com/image.jpg')
  })

  test('allows relative paths', () => {
    const input = '/images/photo.jpg'
    const result = sanitizeUrl(input)
    expect(result).toBe('/images/photo.jpg')
  })

  test('blocks javascript URLs', () => {
    const input = 'javascript:alert("xss")'
    const result = sanitizeUrl(input)
    expect(result).toBe('')
  })

  test('blocks data URLs', () => {
    const input = 'data:text/html,<script>alert("xss")</script>'
    const result = sanitizeUrl(input)
    expect(result).toBe('')
  })

  test('removes dangerous characters', () => {
    const input = 'https://example.com/image.jpg<script>'
    const result = sanitizeUrl(input)
    expect(result).toBe('https://example.com/image.jpgscript')
  })

  test('limits length', () => {
    const input = 'https://example.com/' + 'a'.repeat(600)
    const result = sanitizeUrl(input)
    expect(result.length).toBeLessThanOrEqual(500)
  })
})