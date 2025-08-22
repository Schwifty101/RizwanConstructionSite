import { getAdminProjects } from '@/lib/admin-actions'
import { ProjectsTable } from './components/projects-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/ui/back-button'
import Link from 'next/link'
import { Plus, AlertCircle } from 'lucide-react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const result = await getAdminProjects()
  
  if (!result.success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <BackButton href="/admin" label="Back to Dashboard" />
              <div className="border-l border-stone-200 pl-4 hidden sm:block">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Projects</h1>
                <p className="text-stone-600 mt-1">
                  Manage your construction portfolio
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-2xl font-bold text-stone-800">Projects</h1>
                <p className="text-stone-600 mt-1">
                  Manage your construction portfolio
                </p>
              </div>
            </div>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Failed to Load Projects</h3>
                  <p className="text-stone-600 mt-1">{result.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const projects = result.data || []

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <BackButton href="/admin" label="Back to Dashboard" />
            <div className="border-l border-stone-200 pl-4 hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Projects</h1>
              <p className="text-stone-600 mt-1">
                Manage your construction portfolio ({projects.length} project{projects.length !== 1 ? 's' : ''})
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-2xl font-bold text-stone-800">Projects</h1>
              <p className="text-stone-600 mt-1">
                Manage your construction portfolio ({projects.length} project{projects.length !== 1 ? 's' : ''})
              </p>
            </div>
          </div>
          
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/projects/new" className="flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Link>
          </Button>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200">
          <ProjectsTable projects={projects} />
        </div>
      </div>
    </div>
  )
}