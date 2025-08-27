import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { API_LIMITS, VALIDATION_PATTERNS } from '@/lib/constants'
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '@/lib/sanitize'
import { getClientIdentifier, checkRateLimit, createRateLimitResponse, rateLimiters } from '@/lib/rate-limiter'
export async function POST(request: Request) {
  try {
    const identifier = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.contact)
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime)
    }
    const body = await request.json()
    const { name, email, phone, message } = body
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }
    if (name.length > API_LIMITS.MAX_NAME_LENGTH || message.length > API_LIMITS.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Input too long. Name must be under ${API_LIMITS.MAX_NAME_LENGTH} characters, message under ${API_LIMITS.MAX_MESSAGE_LENGTH}.` },
        { status: 400 }
      )
    }
    if (!VALIDATION_PATTERNS.EMAIL.test(email) || email.length > API_LIMITS.MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid email format or email too long' },
        { status: 400 }
      )
    }
    if (phone && phone.length > API_LIMITS.MAX_PHONE_LENGTH) {
      return NextResponse.json(
        { error: 'Phone number too long' },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: sanitizeInput(name, API_LIMITS.MAX_NAME_LENGTH),
        email: sanitizeEmail(email),
        phone: phone ? sanitizePhone(phone) : null,
        message: sanitizeInput(message, API_LIMITS.MAX_MESSAGE_LENGTH),
        status: 'new'
      }])
      .select()
    if (error) {
      console.error('Error saving contact:', error)
      return NextResponse.json(
        { error: 'Failed to save contact form submission' },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: data[0].id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
