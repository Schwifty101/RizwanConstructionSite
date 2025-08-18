export const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'Modern Family Home',
    description: 'Contemporary 3-bedroom home with open floor plan and sustainable features',
    category: 'Residential',
    images: ['/images/projects/modern-home-1.jpg'],
    date: '2024-01-15',
    location: 'Downtown District',
    slug: 'modern-family-home',
    featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Luxury Kitchen Remodel',
    description: 'Complete kitchen transformation with custom cabinetry and premium appliances',
    category: 'Interior Design',
    images: ['/images/projects/kitchen-remodel-1.jpg'],
    date: '2024-02-28',
    location: 'Suburban Area',
    slug: 'luxury-kitchen-remodel',
    featured: true,
    created_at: '2024-02-28T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z'
  },
  {
    id: '3',
    title: 'Office Space Renovation',
    description: 'Modern office design focusing on productivity and employee wellness',
    category: 'Commercial',
    images: ['/images/projects/office-renovation-1.jpg'],
    date: '2024-03-10',
    location: 'Business District',
    slug: 'office-space-renovation',
    featured: false,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z'
  }
]

export const API_LIMITS = {
  MAX_PROJECTS_LIMIT: 100,
  MAX_NAME_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,
  MAX_TITLE_LENGTH: 255,
  MAX_SLUG_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_IMAGES_PER_PROJECT: 10
}

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9-]+$/
}