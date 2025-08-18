import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { safeAsyncOperation } from "@/lib/error-handler"

async function getFeaturedProjects() {
  return safeAsyncOperation(
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
    [], // fallback to empty array
    'getFeaturedProjects'
  )
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream to-beige">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6">
            Quality Construction<br />
            <span className="text-muted-gold">& Design</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional construction and interior design services. 
            Bringing your vision to life with quality craftsmanship and attention to detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our latest construction and design work that showcases our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Project Image</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{project.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {project.category} • {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/portfolio/${project.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Featured projects will appear here once the database is configured.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/portfolio">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From conception to completion, we provide comprehensive construction and design solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Construction",
                description: "Complete home building services from foundation to finish"
              },
              {
                title: "Interior Design",
                description: "Professional interior design consulting and implementation"
              },
              {
                title: "Renovation Services",
                description: "Transform your existing space with expert renovation"
              }
            ].map((service, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="font-serif">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/services">All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
