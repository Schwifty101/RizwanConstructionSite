// Server-side sanitization utility
// Note: DOMPurify is primarily designed for browser environments
// For Node.js server-side sanitization, we'll use a more robust approach

import { API_LIMITS } from './constants'

/**
 * Sanitizes input strings to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeInput(input: string, maxLength = API_LIMITS.MAX_MESSAGE_LENGTH): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove any HTML-like tags completely
    .replace(/<[^>]*>/g, '')
    // Remove script injection attempts
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Remove data URIs that could contain malicious content
    .replace(/data:[^;]*;base64[^"']*/gi, '')
    // Remove common XSS patterns
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length
    .substring(0, maxLength)
}

/**
 * Sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, API_LIMITS.MAX_EMAIL_LENGTH)
}

/**
 * Sanitizes phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }

  return phone
    .trim()
    .replace(/[^\d\s\-\+\(\)\.]/g, '') // Keep only digits and common phone formatting
    .substring(0, API_LIMITS.MAX_PHONE_LENGTH)
}

/**
 * Sanitizes URL strings for image paths
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  // Only allow safe protocols and relative paths
  const allowedProtocols = /^(https?:|\/)/i
  
  if (!allowedProtocols.test(url.trim())) {
    return ''
  }

  return url
    .trim()
    .replace(/[<>"'&]/g, '')
    .substring(0, 500) // Reasonable URL length limit
}