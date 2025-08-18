import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FALLBACK_PROJECTS, API_LIMITS, VALIDATION_PATTERNS } from '@/lib/constants'
import { sanitizeInput, sanitizeUrl } from '@/lib/sanitize'
import { getClientIdentifier, checkRateLimit, createRateLimitResponse, rateLimiters } from '@/lib/rate-limiter'

export async function GET(request: Request) {
  try {
    // Check rate limit
    const identifier = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.projects)
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let query = supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (limit) {
      const limitNum = parseInt(limit)
      if (isNaN(limitNum) || limitNum < 1 || limitNum > API_LIMITS.MAX_PROJECTS_LIMIT) {
        return NextResponse.json(
          { error: `Invalid limit parameter. Must be between 1 and ${API_LIMITS.MAX_PROJECTS_LIMIT}.` },
          { status: 400 }
        )
      }
      query = query.limit(limitNum)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)

      // Return fallback data when database is not available
      let filteredData = [...FALLBACK_PROJECTS]

      if (category) {
        filteredData = filteredData.filter(project => project.category === category)
      }

      if (featured === 'true') {
        filteredData = filteredData.filter(project => project.featured)
      }

      if (limit) {
        filteredData = filteredData.slice(0, parseInt(limit))
      }

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


export async function POST(request: Request) {
  try {
    // Check rate limit
    const identifier = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.projects)
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime)
    }

    const body = await request.json()
    const { title, description, category, images, date, location, slug, featured } = body

    // Validate required fields
    if (!title || !category || !date || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, date, slug' },
        { status: 400 }
      )
    }

    // Validate input lengths
    if (title.length > API_LIMITS.MAX_TITLE_LENGTH || slug.length > API_LIMITS.MAX_SLUG_LENGTH) {
      return NextResponse.json(
        { error: `Title and slug must be under ${API_LIMITS.MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      )
    }

    if (description && description.length > API_LIMITS.MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Description must be under ${API_LIMITS.MAX_DESCRIPTION_LENGTH} characters` },
        { status: 400 }
      )
    }

    // Validate date format
    if (!Date.parse(date)) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!VALIDATION_PATTERNS.SLUG.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: sanitizeInput(title, API_LIMITS.MAX_TITLE_LENGTH),
        description: description ? sanitizeInput(description, API_LIMITS.MAX_DESCRIPTION_LENGTH) : null,
        category: sanitizeInput(category, 50),
        images: Array.isArray(images) 
          ? images.slice(0, API_LIMITS.MAX_IMAGES_PER_PROJECT).map(img => sanitizeUrl(img))
          : [],
        date,
        location: location ? sanitizeInput(location, 100) : null,
        slug: slug.toLowerCase(),
        featured: Boolean(featured)
      }])
      .select()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}