import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAdminProjects } from '@/lib/admin-actions'
import { FolderOpen, Plus, BarChart3, Eye, Calendar } from 'lucide-react'
import { AuthenticatedLayout } from './components/authenticated-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const projectsResult = await getAdminProjects()
  const projects = projectsResult.success ? projectsResult.data || [] : []

  const stats = {
    totalProjects: projects.length,
    featuredProjects: projects.filter(p => p.featured).length,
    recentProjects: projects.filter(p => {
      const projectDate = new Date(p.created_at)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return projectDate > thirtyDaysAgo
    }).length
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-600 mt-1">
            Manage your construction portfolio and content
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/projects" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>Manage Projects</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-stone-600">
              All projects in portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProjects}</div>
            <p className="text-xs text-stone-600">
              Highlighted on homepage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Projects</CardTitle>
            <Calendar className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentProjects}</div>
            <p className="text-xs text-stone-600">
              Added in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Project Management</span>
            </CardTitle>
            <CardDescription>
              Add, edit, or delete projects in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/projects">
                Manage All Projects
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/projects/new">
                Add New Project
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>View Website</span>
            </CardTitle>
            <CardDescription>
              Preview your changes on the live website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/" target="_blank">
                View Homepage
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/portfolio" target="_blank">
                View Portfolio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest portfolio additions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-md">
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-800">{project.title}</h3>
                    <p className="text-sm text-stone-600">
                      {project.category} • {new Date(project.date).toLocaleDateString()}
                      {project.featured && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/portfolio/${project.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </AuthenticatedLayout>
  )
}