import Link from "next/link"
import { supabase, Project } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { safeAsyncOperation } from "@/lib/error-handler"
import { FALLBACK_PROJECTS } from "@/lib/constants"
import { PortfolioClient } from "./portfolio-client"

const categories = ["All", "Residential", "Commercial", "Interior Design", "Renovation"]

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

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our collection of completed projects showcasing quality craftsmanship 
            and innovative design solutions across residential and commercial spaces.
          </p>
        </div>
      </section>

      {/* Client-side filtering and projects display */}
      <PortfolioClient projects={projects} categories={categories} />

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Start Your Next Project
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to bring your vision to life? Contact us today to discuss your 
            construction or design project and get a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}