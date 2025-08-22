'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BackButton } from '@/components/ui/back-button'
import { ProjectForm } from '../components/project-form'

export default function NewProjectPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/projects')
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/projects')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <BackButton href="/admin/projects" label="Back to Projects" />
            <div className="border-l border-stone-200 pl-4 hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Add New Project</h1>
              <p className="text-stone-600 mt-1">
                Create a new project for your portfolio
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-2xl font-bold text-stone-800">Add New Project</h1>
              <p className="text-stone-600 mt-1">
                Create a new project for your portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Project Details</CardTitle>
            <CardDescription>
              Fill in the information below to add a new project to your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ProjectForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}