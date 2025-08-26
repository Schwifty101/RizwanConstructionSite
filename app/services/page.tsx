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

// No fallback services - all services come from database

export default async function Services() {
  const services = await getServices()

  return <ServicesClient services={services} />
}