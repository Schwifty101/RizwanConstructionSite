'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BackButton } from '@/components/ui/back-button'
import { ProjectForm } from '../../components/project-form'
import { getAdminProjects } from '@/lib/admin-actions'
import type { Project } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getAdminProjects()
        if (result.success && result.data) {
          const foundProject = result.data.find(p => p.id === params.id)
          if (foundProject) {
            setProject(foundProject)
          } else {
            setError('Project not found')
          }
        } else {
          setError(result.error || 'Failed to fetch project')
        }
      } catch {
        setError('An error occurred while fetching the project')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchProject()
    }
  }, [params.id])
  const handleSuccess = () => {
    router.push('/admin/projects')
    router.refresh()
  }
  const handleCancel = () => {
    router.push('/admin/projects')
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <BackButton href="/admin/projects" label="Back to Projects" />
              <div className="border-l border-stone-200 pl-4 hidden sm:block">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Edit Project</h1>
                <p className="text-stone-600 mt-1">Loading project details...</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-2xl font-bold text-stone-800">Edit Project</h1>
                <p className="text-stone-600 mt-1">Loading project details...</p>
              </div>
            </div>
          </div>
          <Card className="shadow-sm">
            <CardContent className="py-12">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-stone-600" />
                <span className="text-stone-600">Loading project...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <BackButton href="/admin/projects" label="Back to Projects" />
              <div className="border-l border-stone-200 pl-4 hidden sm:block">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Edit Project</h1>
                <p className="text-stone-600 mt-1">Project not found</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-2xl font-bold text-stone-800">Edit Project</h1>
                <p className="text-stone-600 mt-1">Project not found</p>
              </div>
            </div>
          </div>
          <Card className="shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-red-600 text-lg">{error || 'Project not found'}</p>
                <p className="text-stone-500 mt-2">The project you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="max-w-4xl mx-auto space-y-6">
        {}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <BackButton href="/admin/projects" label="Back to Projects" />
            <div className="border-l border-stone-200 pl-4 hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Edit Project</h1>
              <p className="text-stone-600 mt-1">
                Update &ldquo;{project.title}&rdquo; details
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-2xl font-bold text-stone-800">Edit Project</h1>
              <p className="text-stone-600 mt-1">
                Update &ldquo;{project.title}&rdquo; details
              </p>
            </div>
          </div>
        </div>
        {}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Project Details</CardTitle>
            <CardDescription>
              Modify the project information below.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ProjectForm 
              project={project}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
