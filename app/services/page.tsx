import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

async function getServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

const defaultServices = [
  {
    id: '1',
    name: 'Residential Construction',
    description: 'Complete home building services from foundation to finish, including new construction, additions, and major renovations.',
    details: [
      'New home construction',
      'Home additions and extensions',
      'Foundation and structural work',
      'Roofing and siding',
      'Custom architectural features'
    ]
  },
  {
    id: '2',
    name: 'Interior Design',
    description: 'Professional interior design consulting and implementation to transform your living and working spaces.',
    details: [
      'Space planning and design consultation',
      'Color schemes and material selection',
      'Custom furniture and fixtures',
      'Lighting design and installation',
      'Project management and coordination'
    ]
  },
  {
    id: '3',
    name: 'Kitchen Remodeling',
    description: 'Transform your kitchen with custom design, premium materials, and expert craftsmanship.',
    details: [
      'Custom cabinetry design and installation',
      'Countertop selection and installation',
      'Appliance integration',
      'Plumbing and electrical updates',
      'Complete kitchen renovations'
    ]
  },
  {
    id: '4',
    name: 'Bathroom Renovation',
    description: 'Create beautiful, functional bathrooms with modern fixtures and thoughtful design.',
    details: [
      'Complete bathroom remodels',
      'Tile and flooring installation',
      'Fixture selection and installation',
      'Vanity and storage solutions',
      'Accessibility modifications'
    ]
  },
  {
    id: '5',
    name: 'Commercial Construction',
    description: 'Professional commercial construction and renovation services for offices, retail, and industrial spaces.',
    details: [
      'Office space construction and renovation',
      'Retail buildouts',
      'Warehouse and industrial construction',
      'ADA compliance modifications',
      'Tenant improvements'
    ]
  },
  {
    id: '6',
    name: 'Project Consultation',
    description: 'Expert advice and project planning services to help you make informed decisions about your construction project.',
    details: [
      'Project feasibility assessment',
      'Budget planning and cost estimation',
      'Design consultation',
      'Permit assistance',
      'Timeline development'
    ]
  }
]

export default async function Services() {
  const services = await getServices()
  const displayServices = services.length > 0 ? services : defaultServices

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive construction and design solutions tailored to your needs. 
            From concept to completion, we deliver exceptional results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {displayServices.map((service, index) => (
              <Card key={service.id || index} className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-t-lg">
                    <span className="text-muted-foreground">Service Image</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  {'details' in service && (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {service.details.slice(0, 3).map((detail: string, idx: number) => (
                        <li key={idx}>• {detail}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Services Accordion */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Service Details
              </h2>
              <p className="text-lg text-muted-foreground">
                Learn more about what each service includes and how we can help with your project.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {displayServices.map((service, index) => (
                <AccordionItem key={service.id || index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-serif text-lg">
                    {service.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      {'details' in service && (
                        <div>
                          <h4 className="font-semibold mb-3">What&apos;s included:</h4>
                          <ul className="space-y-2 text-muted-foreground">
                            {service.details.map((detail: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-muted-gold mr-2">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We follow a proven process to ensure your project is completed successfully, 
              on time, and within budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Consultation",
                description: "Initial meeting to discuss your vision, requirements, and budget"
              },
              {
                step: "2",
                title: "Planning",
                description: "Detailed project planning, design, and timeline development"
              },
              {
                step: "3",
                title: "Execution",
                description: "Professional construction with regular updates and quality control"
              },
              {
                step: "4",
                title: "Completion",
                description: "Final walkthrough, cleanup, and project handover"
              }
            ].map((phase, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-muted-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {phase.step}
                  </div>
                  <CardTitle className="font-serif">{phase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {phase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Contact us today to discuss your project and receive a personalized quote. 
            We&apos;re here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}