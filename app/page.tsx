import Script from "next/script"
import { supabase } from "@/lib/supabase"
import { safeDatabaseOperation } from "@/lib/error-handler"
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo"
import { HomeClient } from "./home-client"
async function getFeaturedProjects() {
  return safeDatabaseOperation(
    async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('date', { ascending: false })
        .limit(3)
      if (error) {
        throw new Error(`Failed to fetch featured projects: ${error.message}`)
      }
      return data || []
    },
    [], 
    'getFeaturedProjects',
    false 
  )
}
export default async function Home() {
  const featuredProjects = await getFeaturedProjects()
  const serviceSchema = generateServiceSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' }
  ])
  return (
    <>
      {}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <HomeClient featuredProjects={featuredProjects} />
    </>
  )
}
