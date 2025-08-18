import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper function to sanitize input and prevent XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    // Validate input lengths
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Input too long. Name must be under 100 characters, message under 2000.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 255) {
      return NextResponse.json(
        { error: 'Invalid email format or email too long' },
        { status: 400 }
      )
    }

    // Validate phone if provided
    if (phone && phone.length > 20) {
      return NextResponse.json(
        { error: 'Phone number too long' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: sanitizeInput(name),
        email: email.trim().toLowerCase(),
        phone: phone ? sanitizeInput(phone) : null,
        message: sanitizeInput(message),
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