import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.siteUrl
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/false-ceiling-islamabad`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/interior-designer-islamabad`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not available for sitemap generation')
      return staticRoutes
    }
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, date')
      .order('date', { ascending: false })
    interface Project {
      slug: string;
      date: string;
    }
    const projectRoutes = (projects || []).map((project: Project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
    return [...staticRoutes, ...projectRoutes]
  } catch (error) {
    console.warn('Error fetching projects for sitemap:', error)
    return staticRoutes
  }
}
