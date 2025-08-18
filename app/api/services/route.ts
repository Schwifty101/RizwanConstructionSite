import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
          name: 'Residential Construction',
          description: 'Complete home building services from foundation to finish',
          image_url: '/images/services/residential.jpg',
          order_index: 1,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Interior Design',
          description: 'Professional interior design consulting and implementation',
          image_url: '/images/services/interior-design.jpg',
          order_index: 2,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Kitchen Remodeling',
          description: 'Custom kitchen design and renovation services',
          image_url: '/images/services/kitchen.jpg',
          order_index: 3,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Bathroom Renovation',
          description: 'Modern bathroom design and construction',
          image_url: '/images/services/bathroom.jpg',
          order_index: 4,
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, image_url, order_index, active } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('services')
      .insert([{
        name,
        description,
        image_url,
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
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}