'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectForm } from '../components/project-form'

export default function NewProjectPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/projects')
    router.refresh()
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Add New Project</h1>
        <p className="text-stone-600 mt-1">
          Create a new project for your portfolio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new project to your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}