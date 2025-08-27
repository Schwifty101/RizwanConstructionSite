import { API_LIMITS } from './constants'
export function sanitizeInput(input: string, maxLength = API_LIMITS.MAX_MESSAGE_LENGTH): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:[^;]*;base64[^"']*/gi, '')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .substring(0, maxLength)
}
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>"'&]/g, '') 
    .substring(0, API_LIMITS.MAX_EMAIL_LENGTH)
}
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }
  return phone
    .trim()
    .replace(/[^\d\s\-\+\(\)\.]/g, '') 
    .substring(0, API_LIMITS.MAX_PHONE_LENGTH)
}
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }
  const allowedProtocols = /^(https?:|\/)/i
  if (!allowedProtocols.test(url.trim())) {
    return ''
  }
  return url
    .trim()
    .replace(/[<>"'&]/g, '')
    .substring(0, 500) 
}
