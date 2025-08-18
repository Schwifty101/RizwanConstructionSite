import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('date', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured projects:', error)

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
        }
      ]

      return NextResponse.json(fallbackData)
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