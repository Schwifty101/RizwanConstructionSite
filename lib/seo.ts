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
  siteName: 'Professional Construction & Interior Design Services - Islamabad | Rawalpindi',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rizwan-interiors.vercel.app',
  defaultImage: '/images/og-image.jpg',
  twitterHandle: '@rizwaninteriors',
  author: 'Rizwan Construction & Interiors',
  phone: '+92-300-5131990',
  email: 'info@rizwaninteriors.com',
  address: {
    streetAddress: 'Sector G-10, Markaz',
    city: 'Islamabad',
    state: 'Islamabad Capital Territory',
    postalCode: '44000',
    country: 'PK'
  },
  businessHours: {
    weekdays: 'Mo-Fr 09:00-18:00',
    saturday: 'Sa 09:00-17:00',
    sunday: 'Su Closed'
  },
  serviceAreas: ['Islamabad', 'Rawalpindi', 'Chakwal', 'Attock', 'Taxila'],
  coordinates: {
    lat: 33.6844,
    lng: 73.0479
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
    'interior design',
    'construction services',
    'texture coating',
    'zola paint',
    'window blinds',
    'vinyl flooring',
    'wooden flooring',
    'false ceilings',
    'aluminium glass work',
    'custom blinds',
    'curtains',
    'interior designer Islamabad',
    'construction company Islamabad',
    'interior design Rawalpindi',
    'false ceiling contractor Islamabad',
    'office interior design Islamabad',
    'texture coating Islamabad',
    'wooden flooring Islamabad',
    'vinyl flooring Rawalpindi',
    'window blinds Islamabad',
    'aluminum glass work Islamabad',
    'home interiors Pakistan',
    'hotel interiors Islamabad',
    'restaurant interiors Rawalpindi',
    'office interiors Islamabad',
    'commercial construction Pakistan',
    'residential interior design',
    'best interior designer in Islamabad',
    'professional construction services Pakistan',
    'modern interior design Islamabad',
    'luxury home interiors Pakistan'
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
    themeColor: '#C9A66B' 
  }
}
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
    ]
  }
}
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.siteUrl}#LocalBusiness`,
    name: 'Rizwan Construction & Interior Design Services',
    alternateName: 'Rizwan Interiors Islamabad',
    description: 'Professional construction and interior design services in Islamabad and Rawalpindi. Specializing in false ceilings, texture coating, wooden flooring, window blinds, and complete interior solutions for homes, offices, hotels, and restaurants.',
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
      latitude: SITE_CONFIG.coordinates.lat,
      longitude: SITE_CONFIG.coordinates.lng
    },
    openingHours: [
      SITE_CONFIG.businessHours.weekdays,
      SITE_CONFIG.businessHours.saturday
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Bank Transfer', 'Mobile Payment'],
    currenciesAccepted: 'PKR',
    serviceArea: SITE_CONFIG.serviceAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'Country',
        name: 'Pakistan'
      }
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interior Design & Construction Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'False Ceiling Installation',
            description: 'Professional false ceiling installation and design services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Texture Coating & Zola Paint',
            description: 'Wall texture coating and premium paint services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wooden & Vinyl Flooring',
            description: 'High-quality flooring installation and maintenance'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Window Blinds & Curtains',
            description: 'Custom window treatments and blinds installation'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Complete Interior Design',
            description: 'Full interior design services for residential and commercial spaces'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1'
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
    name: 'Professional Interior Design & Construction Services - Islamabad | Rawalpindi',
    description: 'Expert interior design and construction services in Islamabad and Rawalpindi, Pakistan. Specializing in false ceilings, texture coating, wooden flooring, window blinds, aluminum glass work, and complete interior solutions for residential and commercial spaces.',
    provider: {
      '@type': 'Organization',
      name: 'Rizwan Construction & Interior Design Services',
      url: SITE_CONFIG.siteUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: SITE_CONFIG.address.state,
        addressCountry: 'Pakistan'
      }
    },
    serviceType: [
      'False Ceiling Installation Islamabad',
      'Texture Coating & Zola Paint Services',
      'Window Blinds & Curtains Installation',
      'Vinyl & Wooden Flooring Pakistan',
      'Aluminium & Glass Work',
      'Residential Interior Design',
      'Commercial Interior Design',
      'Hotel & Restaurant Interior Design',
      'Office Interior Design Islamabad',
      'Home Renovation Services',
      'Construction Services Pakistan'
    ],
    areaServed: SITE_CONFIG.serviceAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Punjab & Islamabad Capital Territory',
        containedInPlace: {
          '@type': 'Country',
          name: 'Pakistan'
        }
      }
    })),
    offers: {
      '@type': 'AggregateOffer',
      priceRange: '$$',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock'
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional Certification',
      competencyRequired: 'Interior Design & Construction'
    }
  }
}
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What interior design services do you offer in Islamabad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer comprehensive interior design services including false ceiling installation, texture coating, wooden and vinyl flooring, window blinds, aluminum glass work, and complete interior solutions for homes, offices, hotels, and restaurants in Islamabad and Rawalpindi.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide false ceiling services in Rawalpindi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide professional false ceiling installation and design services throughout Rawalpindi, Islamabad, and surrounding areas including Chakwal, Attock, and Taxila.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of flooring do you install?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We specialize in wooden flooring, vinyl flooring, laminate flooring, and other premium flooring solutions. Our team ensures professional installation with quality materials suitable for Pakistan\'s climate.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you work on commercial interior projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we handle both residential and commercial interior design projects including offices, hotels, restaurants, retail spaces, and other commercial establishments in Islamabad and Rawalpindi.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the cost of interior design services in Islamabad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our interior design costs vary based on project scope, materials, and requirements. We offer competitive rates for all services including texture coating, false ceilings, flooring, and complete interior solutions. Contact us for a detailed quote.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does a typical interior design project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project timelines depend on scope and complexity. Simple projects like texture coating or blinds installation may take 3-7 days, while complete interior renovations can take 4-8 weeks. We provide detailed timelines during consultation.'
        }
      }
    ]
  }
}
