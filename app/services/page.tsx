import { supabase } from "@/lib/supabase"
import { ServicesClient } from "./services-client"

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

  return <ServicesClient services={displayServices} />
}