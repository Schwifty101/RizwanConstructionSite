import { notFound } from "next/navigation"
import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { ImageSlideshow } from "@/components/ui/image-slideshow"
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
      {}
      <section className="py-6 bg-gradient-to-r from-charcoal/90 to-warm-brown/90 texture-grain relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button asChild variant="ghost" className="mb-0 text-paper-white/90 hover:text-dusty-gold hover:bg-paper-white/10 transition-all duration-300">
            <Link href="/portfolio" className="flex items-center gap-3 font-medium tracking-wide">
              <ArrowLeft className="h-5 w-5" />
              <span>Return to Portfolio</span>
            </Link>
          </Button>
        </div>
        {}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-dusty-gold/40 to-transparent"></div>
      </section>
      {}
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
      {}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {}
            <div className="mb-12">
              {project.images && project.images.length > 0 ? (
                <ImageSlideshow
                  images={project.images}
                  alt={project.title}
                  aspectRatio="video"
                  autoPlay={true}
                  autoPlayInterval={4500}
                  showDots={true}
                  showArrows={true}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="rounded-xl shadow-2xl"
                />
              ) : (
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-muted-foreground text-lg">Project Images</span>
                </div>
              )}
            </div>
            {}
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
                <div className="bg-card border rounded-lg p-6 mb-8">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-6">Project Details</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>
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
      {}
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
                <div key={relatedProject.id} className="group hover:shadow-lg transition-shadow duration-300 bg-card border rounded-lg overflow-hidden">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {relatedProject.images && relatedProject.images.length > 0 ? (
                      <ImageSlideshow
                        images={relatedProject.images}
                        alt={relatedProject.title}
                        aspectRatio="portrait"
                        autoPlay={true}
                        autoPlayInterval={3500}
                        showDots={relatedProject.images.length > 1}
                        showArrows={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Project Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">{relatedProject.title}</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {relatedProject.location} • {new Date(relatedProject.date).getFullYear()}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {relatedProject.description}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/portfolio/${relatedProject.slug}`}>View Project</Link>
                    </Button>
                  </div>
                </div>
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
