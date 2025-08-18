import { notFound } from "next/navigation"
import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react"
import { supabase, Project } from "@/lib/supabase"

async function getProject(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

async function getRelatedProjects(currentProjectId: string, category: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .neq('id', currentProjectId)
      .limit(3)

    if (error) {
      console.error('Error fetching related projects:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching related projects:', error)
    return []
  }
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project.id, project.category)

  return (
    <PageWrapper>
      {/* Navigation */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
      </section>

      {/* Project Hero */}
      <section className="py-12 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{project.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.date).getFullYear()}</span>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Image */}
            <div className="mb-8">
              <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-lg">Main Project Image</span>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                  <span className="text-muted-foreground">Image {index}</span>
                </div>
              ))}
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Project Overview
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-4">
                    This {project.category.toLowerCase()} project showcases our commitment to quality 
                    craftsmanship and attention to detail. Located in {project.location}, this project 
                    represents the perfect blend of functionality and aesthetic appeal.
                  </p>
                  <p className="mb-4">
                    {project.description} The project was completed in {new Date(project.date).getFullYear()}, 
                    meeting all client requirements and exceeding expectations for both design and execution.
                  </p>
                  <p>
                    Throughout the construction process, we maintained close communication with the client 
                    to ensure every detail aligned with their vision while adhering to our high standards 
                    of quality and craftsmanship.
                  </p>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Category</h4>
                      <p className="text-muted-foreground">{project.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Location</h4>
                      <p className="text-muted-foreground">{project.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Completion Date</h4>
                      <p className="text-muted-foreground">
                        {new Date(project.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                    {project.featured && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Status</h4>
                        <span className="inline-block bg-muted-gold text-white px-3 py-1 rounded-full text-sm">
                          Featured Project
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-8">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/contact">Start Your Project</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Related Projects
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore more {project.category.toLowerCase()} projects from our portfolio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedProjects.map((relatedProject) => (
                <Card key={relatedProject.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Project Image</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{relatedProject.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {relatedProject.location} • {new Date(relatedProject.date).getFullYear()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {relatedProject.description}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/portfolio/${relatedProject.slug}`}>View Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/portfolio">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  )
}