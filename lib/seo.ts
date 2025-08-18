import { Metadata, Viewport } from 'next'

interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  noIndex?: boolean
}

export const SITE_CONFIG = {
  siteName: 'Rizwan Construction & Interior Design',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rizwan-construction.com',
  defaultImage: '/images/og-image.jpg',
  twitterHandle: '@rizwanconstruction',
  author: 'Rizwan Construction',
  phone: '+1-555-0123',
  email: 'info@rizwanconstruction.com',
  address: {
    streetAddress: '123 Construction Ave',
    city: 'Your City',
    state: 'Your State',
    postalCode: '12345',
    country: 'US'
  }
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  noIndex = false
}: SeoConfig): Metadata {
  const fullTitle = title.includes(SITE_CONFIG.siteName) ? title : `${title} | ${SITE_CONFIG.siteName}`
  const imageUrl = image ? `${SITE_CONFIG.siteUrl}${image}` : `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}`
  const canonicalUrl = url ? `${SITE_CONFIG.siteUrl}${url}` : SITE_CONFIG.siteUrl

  const allKeywords = [
    ...keywords,
    'construction',
    'interior design',
    'contractor',
    'renovation',
    'home improvement',
    'residential construction',
    'commercial construction',
    'custom homes',
    'remodeling'
  ]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: author || SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.author,
    ...(noIndex && { robots: 'noindex, nofollow' }),
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_US',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || SITE_CONFIG.author],
        section
      })
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title: fullTitle,
      description,
      images: [imageUrl]
    },
    manifest: '/site.webmanifest'
  }

  return metadata
}

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#C9A66B' // muted-gold color
  }
}

// Structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/images/logo.jpg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      email: SITE_CONFIG.email
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country
    },
    sameAs: [
      // Add social media URLs here
    ]
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.siteUrl}#LocalBusiness`,
    name: SITE_CONFIG.siteName,
    description: 'Professional construction and interior design services. Quality craftsmanship for residential and commercial projects.',
    url: SITE_CONFIG.siteUrl,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Add latitude and longitude if available
    },
    openingHours: [
      'Mo-Fr 08:00-17:00',
      'Sa 09:00-15:00'
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Check'],
    currenciesAccepted: 'USD',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates'
        // Add coordinates
      },
      geoRadius: '50000' // 50km radius
    }
  }
}

interface ProjectSchemaInput {
  title: string
  description: string
  date: string
  category: string
  images?: string[]
  location?: string
  slug: string
}

export function generateProjectSchema(project: ProjectSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_CONFIG.siteUrl}/portfolio/${project.slug}#CreativeWork`,
    name: project.title,
    description: project.description,
    creator: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.siteUrl
    },
    dateCreated: project.date,
    category: project.category,
    image: project.images?.map((img: string) => `${SITE_CONFIG.siteUrl}${img}`),
    locationCreated: {
      '@type': 'Place',
      name: project.location
    },
    keywords: [project.category, 'construction', 'interior design'],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.siteUrl}/portfolio/${project.slug}`
    }
  }
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.siteUrl}${item.url}`
    }))
  }
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_CONFIG.siteUrl}/services#Service`,
    name: 'Construction and Interior Design Services',
    description: 'Professional construction and interior design services for residential and commercial projects.',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.siteUrl
    },
    serviceType: [
      'Construction',
      'Interior Design', 
      'Home Renovation',
      'Commercial Construction',
      'Residential Construction'
    ],
    areaServed: {
      '@type': 'State',
      name: SITE_CONFIG.address.state
    }
  }
}