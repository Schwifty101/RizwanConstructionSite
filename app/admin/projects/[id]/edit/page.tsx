'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectForm } from '../../components/project-form'
import { getAdminProjects } from '@/lib/admin-actions'
import type { Project } from '@/lib/supabase'

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
    router.back()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Edit Project</h1>
          <p className="text-stone-600 mt-1">Loading project details...</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Edit Project</h1>
          <p className="text-stone-600 mt-1">Project not found</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">{error || 'Project not found'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Edit Project</h1>
        <p className="text-stone-600 mt-1">
          Update &ldquo;{project.title}&rdquo; details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Modify the project information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            project={project}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}