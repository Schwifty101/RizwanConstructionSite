import { getAdminProjects } from '@/lib/admin-actions'
import { ProjectsTable } from './components/projects-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const result = await getAdminProjects()
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-stone-800">Projects</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load projects: {result.error}</p>
        </div>
      </div>
    )
  }

  const projects = result.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Projects</h1>
          <p className="text-stone-600 mt-1">
            Manage your construction portfolio
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/projects/new" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Link>
        </Button>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}