import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { generateMetadata, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: "False Ceiling Contractor in Islamabad | Professional Installation Services",
  description: "Leading false ceiling contractor in Islamabad offering professional installation services. Gypsum, POP, and modern false ceiling designs for homes, offices, hotels. Free quotes & quality workmanship guaranteed.",
  keywords: [
    "false ceiling contractor Islamabad",
    "false ceiling installation Islamabad", 
    "gypsum ceiling Islamabad",
    "POP ceiling contractor",
    "ceiling design Islamabad",
    "false ceiling cost Islamabad",
    "office ceiling contractor",
    "home false ceiling services"
  ],
  url: "/services/false-ceiling-islamabad",
})

export default function FalseCeilingIslamabadPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'False Ceiling Islamabad', url: '/services/false-ceiling-islamabad' }
  ])

  const faqSchema = generateFAQSchema()

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
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link> / 
          <Link href="/services" className="hover:text-primary ml-1">Services</Link> / 
          <span className="ml-1">False Ceiling Islamabad</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Professional False Ceiling Contractor in Islamabad
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert false ceiling installation services in Islamabad & Rawalpindi. 
              Transform your space with modern ceiling designs, quality materials, and professional workmanship.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">False Ceiling Services in Islamabad</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Why Choose Our False Ceiling Services?</h3>
                <ul className="space-y-2">
                  <li>✓ 10+ years of experience in Islamabad & Rawalpindi</li>
                  <li>✓ Premium quality gypsum and POP materials</li>
                  <li>✓ Modern and traditional ceiling designs</li>
                  <li>✓ Professional installation team</li>
                  <li>✓ Competitive pricing with transparent quotes</li>
                  <li>✓ Warranty on all ceiling installations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Types of False Ceilings We Install</h3>
                <ul className="space-y-2">
                  <li>• Gypsum Board False Ceilings</li>
                  <li>• POP (Plaster of Paris) Ceilings</li>
                  <li>• Grid False Ceilings</li>
                  <li>• Designer False Ceilings</li>
                  <li>• Office False Ceilings</li>
                  <li>• Residential False Ceilings</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">False Ceiling Cost in Islamabad</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="mb-4">
                Our false ceiling prices are competitive and transparent. The cost depends on:
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                <li>• Material type (Gypsum, POP, Grid)</li>
                <li>• Design complexity</li>
                <li>• Room size and height</li>
                <li>• Additional features (lighting, ventilation)</li>
              </ul>
              <p className="mt-4 font-semibold">
                Contact us for a free quote and site visit in Islamabad, Rawalpindi, or surrounding areas.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Our Service Areas</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Islamabad Sectors</h4>
                <p className="text-sm">F-10, F-11, G-10, G-11, E-11, DHA, Bahria Town, PWD</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Rawalpindi Areas</h4>
                <p className="text-sm">Saddar, Committee Chowk, Commercial Market, Satellite Town</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Other Areas</h4>
                <p className="text-sm">Chakwal, Attock, Taxila, Wah Cantt, Murree</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">What is the cost of false ceiling per square foot in Islamabad?</h4>
                <p className="text-muted-foreground">
                  False ceiling costs in Islamabad range from PKR 250-800 per square foot depending on material and design complexity. 
                  Gypsum ceilings typically cost PKR 300-500 per sq ft, while designer POP ceilings range from PKR 500-800 per sq ft.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">How long does false ceiling installation take?</h4>
                <p className="text-muted-foreground">
                  Installation time depends on room size and design complexity. A standard room (12x12 ft) typically takes 3-5 days, 
                  while larger spaces or intricate designs may take 1-2 weeks.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Do you provide false ceiling services in Rawalpindi?</h4>
                <p className="text-muted-foreground">
                  Yes, we provide comprehensive false ceiling services throughout Rawalpindi, including Saddar, Committee Chowk, 
                  Commercial Market, and all major residential areas.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-primary text-primary-foreground p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ceiling?</h2>
            <p className="text-xl mb-6">Get a free quote for false ceiling installation in Islamabad & Rawalpindi</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+92-300-1234567" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Call +92-300-1234567
              </a>
              <Link href="/contact" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary">
                Get Free Quote
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}