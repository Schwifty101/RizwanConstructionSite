import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FALLBACK_PROJECTS, API_LIMITS, VALIDATION_PATTERNS } from '@/lib/constants'
import { sanitizeInput, sanitizeUrl } from '@/lib/sanitize'
import { getClientIdentifier } from '@/lib/rate-limiter'
import { productionRateLimit, productionRateLimiters, createProductionRateLimitResponse } from '@/lib/redis-rate-limiter'
import { getCurrentUser, isUserAdmin } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  try {
    // Check rate limit (production-aware)
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await productionRateLimit(identifier, productionRateLimiters.projects)
    
    if (!rateLimitResult.allowed) {
      return createProductionRateLimitResponse(rateLimitResult.resetTime)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'
    const offset = searchParams.get('offset')

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

    // Handle pagination
    let limitNum = API_LIMITS.MAX_PROJECTS_LIMIT || 20 // Default page size
    let offsetNum = 0

    if (limit) {
      limitNum = parseInt(limit)
      if (isNaN(limitNum) || limitNum < 1 || limitNum > (API_LIMITS.MAX_PROJECTS_LIMIT || 100)) {
        return NextResponse.json(
          { error: `Invalid limit parameter. Must be between 1 and ${API_LIMITS.MAX_PROJECTS_LIMIT || 100}.` },
          { status: 400 }
        )
      }
    }

    if (offset) {
      offsetNum = parseInt(offset)
      if (isNaN(offsetNum) || offsetNum < 0) {
        return NextResponse.json(
          { error: 'Invalid offset parameter. Must be a non-negative number.' },
          { status: 400 }
        )
      }
    } else if (page) {
      const pageNum = parseInt(page)
      if (isNaN(pageNum) || pageNum < 1) {
        return NextResponse.json(
          { error: 'Invalid page parameter. Must be a positive number.' },
          { status: 400 }
        )
      }
      offsetNum = (pageNum - 1) * limitNum
    }

    // Apply pagination
    query = query.range(offsetNum, offsetNum + limitNum - 1)

    // Get total count for pagination metadata (separate query)
    const countQuery = supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    if (category) {
      countQuery.eq('category', category)
    }
    if (featured === 'true') {
      countQuery.eq('featured', true)
    }

    const [dataResult, countResult] = await Promise.all([
      query,
      countQuery
    ])

    const { data, error } = dataResult
    const { count } = countResult

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

      // Apply pagination to fallback data
      const paginatedFallback = filteredData.slice(offsetNum, offsetNum + limitNum)

      return NextResponse.json({
        data: paginatedFallback,
        pagination: {
          page: Math.floor(offsetNum / limitNum) + 1,
          limit: limitNum,
          offset: offsetNum,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / limitNum)
        },
        fallback: true
      })
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limitNum)
    const currentPage = Math.floor(offsetNum / limitNum) + 1

    return NextResponse.json({
      data: data || [],
      pagination: {
        page: currentPage,
        limit: limitNum,
        offset: offsetNum,
        total: totalCount,
        totalPages: totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    })
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
    // Check authentication first
    const user = await getCurrentUser(request as NextRequest)
    if (!user || !isUserAdmin(user)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Admin authentication required to create projects.'
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Check rate limit (production-aware)
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await productionRateLimit(identifier, productionRateLimiters.projects)
    
    if (!rateLimitResult.allowed) {
      return createProductionRateLimitResponse(rateLimitResult.resetTime)
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