import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
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
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)

      // Return fallback data when database is not available
      const fallbackData = [
        {
          id: '1',
          title: 'Modern Family Home',
          description: 'Contemporary 3-bedroom home with open floor plan and sustainable features',
          category: 'Residential',
          images: ['/images/projects/modern-home-1.jpg'],
          date: '2024-01-15',
          location: 'Downtown District',
          slug: 'modern-family-home',
          featured: true,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Luxury Kitchen Remodel',
          description: 'Complete kitchen transformation with custom cabinetry and premium appliances',
          category: 'Interior Design',
          images: ['/images/projects/kitchen-remodel-1.jpg'],
          date: '2024-02-28',
          location: 'Suburban Area',
          slug: 'luxury-kitchen-remodel',
          featured: true,
          created_at: '2024-02-28T00:00:00Z',
          updated_at: '2024-02-28T00:00:00Z'
        },
        {
          id: '3',
          title: 'Office Space Renovation',
          description: 'Modern office design focusing on productivity and employee wellness',
          category: 'Commercial',
          images: ['/images/projects/office-renovation-1.jpg'],
          date: '2024-03-10',
          location: 'Business District',
          slug: 'office-space-renovation',
          featured: false,
          created_at: '2024-03-10T00:00:00Z',
          updated_at: '2024-03-10T00:00:00Z'
        }
      ]

      let filteredData = fallbackData

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
    const body = await request.json()
    const { title, description, category, images, date, location, slug, featured } = body

    if (!title || !category || !date || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, date, slug' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        category,
        images: images || [],
        date,
        location,
        slug,
        featured: featured || false
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