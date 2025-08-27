import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: "Best Interior Designer in Islamabad | Professional Interior Design Services",
  description: "Top-rated interior designer in Islamabad offering complete interior design solutions. Residential & commercial spaces, modern designs, texture coating, false ceilings. 10+ years experience serving Islamabad & Rawalpindi.",
  keywords: [
    "interior designer Islamabad",
    "best interior designer Islamabad",
    "interior design services Islamabad",
    "home interior designer Pakistan",
    "office interior design Islamabad",
    "residential interior designer",
    "commercial interior design",
    "modern interior design Islamabad"
  ],
  url: "/services/interior-designer-islamabad",
})

export default function InteriorDesignerIslamabadPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Interior Designer Islamabad', url: '/services/interior-designer-islamabad' }
  ])

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Interior Designer Islamabad - Professional Interior Design Services',
    description: 'Professional interior design services in Islamabad and Rawalpindi. Specializing in residential and commercial interior design, modern home interiors, office design, and complete interior solutions.',
    provider: {
      '@type': 'Person',
      name: 'Rizwan Interior Designer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressCountry: 'Pakistan'
      }
    },
    areaServed: ['Islamabad', 'Rawalpindi', 'Chakwal', 'Attock'],
    serviceType: [
      'Residential Interior Design',
      'Commercial Interior Design',
      'Office Interior Design',
      'Home Interior Design',
      'Modern Interior Design',
      'Traditional Interior Design'
    ]
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      <div className="container mx-auto px-4 py-16">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link> /
          <Link href="/services" className="hover:text-primary ml-1">Services</Link> /
          <span className="ml-1">Interior Designer Islamabad</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Professional Interior Designer in Islamabad
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your space with Pakistan&apos;s leading interior design services.
              Specializing in residential and commercial interiors in Islamabad, Rawalpindi, and surrounding areas.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Why Choose Our Interior Design Services?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Expertise</h3>
                <ul className="space-y-2">
                  <li>✓ 10+ years of interior design experience</li>
                  <li>✓ 200+ successful projects in Islamabad & Rawalpindi</li>
                  <li>✓ Specialized in Pakistani architectural styles</li>
                  <li>✓ Modern and traditional design solutions</li>
                  <li>✓ Complete project management</li>
                  <li>✓ Quality materials and skilled craftsmen</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Services</h3>
                <ul className="space-y-2">
                  <li>• Complete Home Interior Design</li>
                  <li>• Office & Commercial Interior Design</li>
                  <li>• Hotel & Restaurant Interior Design</li>
                  <li>• Texture Coating & Wall Treatments</li>
                  <li>• False Ceiling Design & Installation</li>
                  <li>• Wooden & Vinyl Flooring</li>
                  <li>• Window Blinds & Curtains</li>
                  <li>• Aluminum & Glass Work</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Interior Design Specializations</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Residential Interior Design</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete home interior solutions including living rooms, bedrooms, kitchens, and bathrooms.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Modern home interiors</li>
                  <li>• Traditional Pakistani designs</li>
                  <li>• Space optimization</li>
                  <li>• Color consultation</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Commercial Interior Design</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional interior design for offices, retail spaces, and commercial establishments.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Office interior design</li>
                  <li>• Retail space design</li>
                  <li>• Corporate branding integration</li>
                  <li>• Functional workspace solutions</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Hospitality Interior Design</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Specialized interior design for hotels, restaurants, and entertainment venues.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Hotel room design</li>
                  <li>• Restaurant interior design</li>
                  <li>• Reception area design</li>
                  <li>• Ambiance creation</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Our Design Process</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <h4 className="font-semibold mb-2">Consultation</h4>
                <p className="text-sm text-muted-foreground">Initial meeting to understand your requirements and vision</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <h4 className="font-semibold mb-2">Design Planning</h4>
                <p className="text-sm text-muted-foreground">Creating detailed design concepts and 3D visualizations</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <h4 className="font-semibold mb-2">Material Selection</h4>
                <p className="text-sm text-muted-foreground">Choosing quality materials within your budget</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                <h4 className="font-semibold mb-2">Implementation</h4>
                <p className="text-sm text-muted-foreground">Professional execution with quality assurance</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Service Areas in Islamabad & Rawalpindi</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Islamabad Areas We Serve</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• F-10, F-11 Sectors</div>
                  <div>• G-10, G-11 Sectors</div>
                  <div>• E-11 Sector</div>
                  <div>• DHA Islamabad</div>
                  <div>• Bahria Town</div>
                  <div>• PWD Housing</div>
                  <div>• I-8, I-9, I-10 Sectors</div>
                  <div>• Blue Area Commercial</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Rawalpindi Areas We Serve</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Saddar Bazaar</div>
                  <div>• Committee Chowk</div>
                  <div>• Commercial Market</div>
                  <div>• Satellite Town</div>
                  <div>• Chaklala Cantt</div>
                  <div>• Westridge</div>
                  <div>• PWD Colony</div>
                  <div>• Muslim Town</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">What is the cost of interior design services in Islamabad?</h4>
                <p className="text-muted-foreground">
                  Interior design costs vary based on project scope, space size, and design complexity.
                  We offer flexible packages starting from PKR 50,000 for basic room design to comprehensive home interior solutions.
                  Contact us for a detailed quote based on your specific requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Do you provide 3D design visualization?</h4>
                <p className="text-muted-foreground">
                  Yes, we provide detailed 3D design visualizations and renderings to help you visualize the final result before implementation.
                  This ensures you&apos;re completely satisfied with the design before we begin the actual work.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">How long does an interior design project take?</h4>
                <p className="text-muted-foreground">
                  Project timelines depend on scope and complexity. A single room design typically takes 2-4 weeks,
                  while complete home interior projects may take 6-12 weeks. We provide detailed project timelines during consultation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Do you work on both residential and commercial projects?</h4>
                <p className="text-muted-foreground">
                  Yes, we specialize in both residential and commercial interior design projects.
                  Our portfolio includes homes, apartments, offices, retail spaces, restaurants, and hotels throughout Islamabad and Rawalpindi.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-primary text-primary-foreground p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-6">Get expert interior design consultation in Islamabad & Rawalpindi</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+92-300-5131990" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Call +92-300-5131990
              </a>
              <Link href="/contact" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary">
                Free Consultation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}