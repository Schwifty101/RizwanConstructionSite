'use client'

import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from '@/app/admin/projects/components/project-form'
import type { Project } from '@/lib/supabase'
import { FolderPlus, Edit } from 'lucide-react'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  project?: Project
}

export function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project
}: ProjectModalProps) {
  const isEditing = !!project

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-stone-100"
          >
            {isEditing ? (
              <Edit className="w-6 h-6 text-stone-600" />
            ) : (
              <FolderPlus className="w-6 h-6 text-stone-600" />
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DialogTitle className="text-center">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              {isEditing 
                ? 'Update your project details and images.'
                : 'Fill in the details to add a new project to your portfolio.'
              }
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <ProjectForm
            project={project}
            onSuccess={() => {
              onSuccess()
              onClose()
            }}
            onCancel={onClose}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}