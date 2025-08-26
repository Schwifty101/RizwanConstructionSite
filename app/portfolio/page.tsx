import { supabase, Project } from "@/lib/supabase"
import { safeAsyncOperation } from "@/lib/error-handler"
import { FALLBACK_PROJECTS } from "@/lib/constants"
import { PortfolioPageClient } from "./portfolio-page-client"

const categories = ["All", "Home Interiors", "Hotel & Restaurant Interiors", "Office Interiors"]

// Server-side data fetching function
async function getProjects(): Promise<Project[]> {
  return safeAsyncOperation(
    async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`)
      }
      
      return data || []
    },
    FALLBACK_PROJECTS, // fallback to sample data
    'getProjects'
  )
}

export default async function Portfolio() {
  const projects = await getProjects()

  return <PortfolioPageClient projects={projects} categories={categories} />
}