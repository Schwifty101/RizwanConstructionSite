import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/auth-middleware'
import { createAuthenticatedSupabaseClient } from '@/lib/supabase-server'
import { sanitizeInput, sanitizeUrl } from '@/lib/sanitize'
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimiters } from '@/lib/rate-limiter'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    let query = supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })

    if (active === 'true') {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching services:', error)

      // Return fallback data when database is not available
      const fallbackData = [
        {
          id: '1',
          name: 'Texture Coating & Zola Paint',
          description: 'Expert texture coatings and zola paint application for flawless wall finishes',
          image_url: '/images/services/interiorDesign.avif',
          order_index: 1,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Window Blinds',
          description: 'Custom-tailored window blinds designed with precision to match your space character',
          image_url: '/images/services/interiorDesign.avif',
          order_index: 2,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Vinyl & Wooden Flooring',
          description: 'Premium flooring solutions including vinyl and wooden options',
          image_url: '/images/services/interiorDesign.avif',
          order_index: 3,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Home Interiors',
          description: 'Complete interior solutions including doors, windows, ceilings, flooring, and furniture',
          image_url: '/images/services/interiorDesign.avif',
          order_index: 6,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      const filteredData = active === 'true'
        ? fallbackData.filter(service => service.active)
        : fallbackData

      return NextResponse.json(filteredData)
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, rateLimiters.projects)
  
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetTime)
  }

  return withAuth(request, async () => {
    try {
      const body = await request.json()
      const { name, description, image_url, order_index, active } = body

      if (!name) {
        return NextResponse.json(
          { error: 'Missing required field: name' },
          { status: 400 }
        )
      }

      // Sanitize inputs
      const sanitizedName = sanitizeInput(name, 255)
      const sanitizedDescription = description ? sanitizeInput(description, 1000) : undefined
      const sanitizedImageUrl = image_url ? sanitizeUrl(image_url) : undefined

      // Create authenticated supabase client for this request
      const supabaseAuth = createAuthenticatedSupabaseClient(request)

      const { data, error } = await supabaseAuth
        .from('services')
        .insert([{
          name: sanitizedName,
          description: sanitizedDescription,
          image_url: sanitizedImageUrl,
          order_index: order_index || 0,
          active: active !== undefined ? active : true
        }])
        .select()

      if (error) {
        console.error('Error creating service:', error)
        return NextResponse.json(
          { error: 'Failed to create service' },
          { status: 500 }
        )
      }

      return NextResponse.json(data[0], { status: 201 })
    } catch (error) {
      console.error('Error creating service:', error)
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      )
    }
  })
}

export async function PATCH(request: NextRequest) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, rateLimiters.projects)
  
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetTime)
  }

  return withAuth(request, async () => {
    try {
      const body = await request.json()
      const { id, name, description, image_url, order_index, active } = body

      if (!id) {
        return NextResponse.json(
          { error: 'Missing required field: id' },
          { status: 400 }
        )
      }

      const updateData: {
        name?: string
        description?: string
        image_url?: string
        order_index?: number
        active?: boolean
      } = {}
      
      if (name !== undefined) updateData.name = sanitizeInput(name, 255)
      if (description !== undefined) updateData.description = sanitizeInput(description, 1000)
      if (image_url !== undefined) updateData.image_url = sanitizeUrl(image_url)
      if (order_index !== undefined) updateData.order_index = order_index
      if (active !== undefined) updateData.active = active

      // Create authenticated supabase client for this request
      const supabaseAuth = createAuthenticatedSupabaseClient(request)

      const { data, error } = await supabaseAuth
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating service:', error)
        return NextResponse.json(
          { error: 'Failed to update service' },
          { status: 500 }
        )
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data[0])
    } catch (error) {
      console.error('Error updating service:', error)
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      )
    }
  })
}

export async function DELETE(request: NextRequest) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, rateLimiters.projects)
  
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetTime)
  }

  return withAuth(request, async () => {
    try {
      const body = await request.json()
      const { id } = body

      if (!id) {
        return NextResponse.json(
          { error: 'Missing required field: id' },
          { status: 400 }
        )
      }

      // Create authenticated supabase client for this request
      const supabaseAuth = createAuthenticatedSupabaseClient(request)

      // Get the service first to check if it has an image to delete
      const { data: service, error: fetchError } = await supabaseAuth
        .from('services')
        .select('image_url')
        .eq('id', id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching service:', fetchError)
        return NextResponse.json(
          { error: 'Failed to fetch service' },
          { status: 500 }
        )
      }

      // Delete the service from database
      const { error: deleteError } = await supabaseAuth
        .from('services')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('Error deleting service:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete service' },
          { status: 500 }
        )
      }

      // If service had an image, try to delete it from storage
      if (service?.image_url) {
        try {
          // Extract filename from URL
          const url = new URL(service.image_url)
          const pathSegments = url.pathname.split('/')
          const filename = pathSegments[pathSegments.length - 1]
          
          if (filename) {
            await supabaseAuth.storage
              .from('service-images')
              .remove([filename])
          }
        } catch (storageError) {
          // Log but don't fail the request if image deletion fails
          console.warn('Failed to delete service image:', storageError)
        }
      }

      return NextResponse.json({ message: 'Service deleted successfully' })
    } catch (error) {
      console.error('Error deleting service:', error)
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      )
    }
  })
}