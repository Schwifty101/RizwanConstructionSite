export const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'Luxury Home Interior Transformation',
    description: 'Complete home interior makeover with custom texture coating, wooden flooring, and elegant false ceilings',
    category: 'Home Interiors',
    images: ['/images/projects/modern-home-1.jpg'],
    date: '2024-01-15',
    location: 'Downtown District',
    slug: 'luxury-home-interior-transformation',
    featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Hotel Lobby Redesign',
    description: 'International standard hotel lobby design with custom aluminium work and premium blinds',
    category: 'Hotel & Restaurant Interiors',
    images: ['/images/projects/kitchen-remodel-1.jpg'],
    date: '2024-02-28',
    location: 'Business District',
    slug: 'hotel-lobby-redesign',
    featured: true,
    created_at: '2024-02-28T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z'
  },
  {
    id: '3',
    title: 'Modern Office Interior',
    description: 'Contemporary office space featuring custom ceilings, flooring, and window treatments',
    category: 'Office Interiors',
    images: ['/images/projects/office-renovation-1.jpg'],
    date: '2024-03-10',
    location: 'Corporate Center',
    slug: 'modern-office-interior',
    featured: true,
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