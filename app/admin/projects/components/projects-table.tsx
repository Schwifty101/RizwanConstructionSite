'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { deleteProject, toggleProjectFeatured } from '@/lib/admin-actions'
import { Edit, Trash2, Eye, Star, Calendar, MapPin } from 'lucide-react'
import { SupabaseImage } from '@/components/supabase-image'
import type { Project } from '@/lib/supabase'
interface ProjectsTableProps {
  projects: Project[]
}
export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    project: Project | null
  }>({ isOpen: false, project: null })
  const handleDeleteClick = (project: Project) => {
    setDeleteDialog({ isOpen: true, project })
  }
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.project) return
    setDeletingId(deleteDialog.project.id)
    try {
      const result = await deleteProject(deleteDialog.project.id)
      if (!result.success) {
        alert(`Failed to delete project: ${result.error}`)
      } else {
        setDeleteDialog({ isOpen: false, project: null })
        router.refresh()
      }
    } catch {
      alert('An error occurred while deleting the project')
    } finally {
      setDeletingId(null)
    }
  }
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, project: null })
  }
  const handleToggleFeatured = async (project: Project) => {
    setTogglingId(project.id)
    try {
      const result = await toggleProjectFeatured(project.id, !project.featured)
      if (!result.success) {
        alert(`Failed to update project: ${result.error}`)
      } else {
        router.refresh()
      }
    } catch {
      alert('An error occurred while updating the project')
    } finally {
      setTogglingId(null)
    }
  }
  if (projects.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
            <Eye className="w-8 h-8 text-stone-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">No Projects Yet</h3>
            <p className="text-stone-600 mt-1">
              Start building your portfolio by adding your first project
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">Add Your First Project</Link>
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div>
      {}
      <div className="block md:hidden space-y-4 p-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 space-y-3 shadow-sm border border-stone-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {project.images && project.images.length > 0 ? (
                  <SupabaseImage
                    src={project.images[0]}
                    alt={project.title}
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-stone-200 rounded-md flex items-center justify-center">
                    <Eye className="w-6 h-6 text-stone-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-stone-900">{project.title}</h3>
                  {project.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-col justify-center items-start space-y-1 mt-2 text-xs text-stone-500">
                  <span className="px-2 py-1 bg-stone-200 rounded-full">
                    {project.category}
                  </span>
                  <span>{new Date(project.date).toLocaleDateString()}</span>
                  {project.location && <span>{project.location}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFeatured(project)}
                disabled={togglingId === project.id}
                className={`${
                  project.featured 
                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                    : 'text-stone-600 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {togglingId === project.id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Star className={`w-4 h-4 mr-1 ${project.featured ? 'fill-current' : ''}`} />
                    {project.featured ? 'Featured' : 'Feature'}
                  </>
                )}
              </Button>
              <div className="flex items-center space-x-2 ml-auto">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    target="_blank"
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(project)}
                  disabled={deletingId === project.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {}
      <div className="hidden md:block p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {project.images && project.images.length > 0 ? (
                          <SupabaseImage
                            src={project.images[0]}
                            alt={project.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-stone-200 rounded-md flex items-center justify-center">
                            <Eye className="w-5 h-5 text-stone-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-900 truncate">
                          {project.title}
                          {project.featured && (
                            <Star className="inline-block w-4 h-4 ml-2 text-yellow-500 fill-current" />
                          )}
                        </p>
                        {project.description && (
                          <p className="text-sm text-stone-600 truncate">
                            {project.description.substring(0, 80)}
                            {project.description.length > 80 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-stone-100 text-stone-800 rounded-full text-sm">
                      {project.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <span className="text-sm">
                        {new Date(project.date).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-stone-400" />
                        <span className="text-sm">{project.location}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(project)}
                        disabled={togglingId === project.id}
                        className={`w-fit ${
                          project.featured 
                            ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 cursor-pointer' 
                            : 'text-stone-600 hover:text-stone-700 hover:bg-stone-50 cursor-pointer'
                        }`}
                      >
                        {togglingId === project.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Star className={`w-3 h-3 mr-1 ${project.featured ? 'fill-current' : ''}`} />
                            {project.featured ? 'Featured' : 'Feature'}
                          </>
                        )}
                      </Button>
                      <span className="text-xs text-stone-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(project)}
                        disabled={deletingId === project.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
        </Table>
      </div>
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deleteDialog.project?.title || ''}
        isDeleting={deletingId === deleteDialog.project?.id}
      />
    </div>
  )
}
