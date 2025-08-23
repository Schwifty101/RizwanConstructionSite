'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, X, Image as ImageIcon, GripVertical, Loader2 } from 'lucide-react'
import { SupabaseImage } from '@/components/supabase-image'
import type { Project } from '@/lib/supabase'
import {
  StagedImage,
  ImageUploadProgress,
  validateImageFile,
  createStagedImageFromFile,
  createStagedImageFromUrl,
  cleanupObjectUrls,
  uploadStagedImages,
  deleteImagesFromStorage,
  getImagesToDelete,
  reorderStagedImages,
  MAX_IMAGES_PER_PROJECT
} from '@/lib/image-staging'

// Form-specific schema that matches the component's needs (without images)
const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  location: z.string().optional(),
  featured: z.boolean().default(false)
})

type ProjectFormInput = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, ImageUploadProgress>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      category: project?.category ?? '',
      date: project?.date ?? new Date().toISOString().split('T')[0],
      location: project?.location ?? '',
      featured: project?.featured ?? false
    }
  })

  // Initialize staged images from existing project
  useEffect(() => {
    if (project?.images) {
      const existingImages = project.images.map((url, index) => 
        createStagedImageFromUrl(url, `existing-${index}`)
      )
      setStagedImages(existingImages)
    }
  }, [project?.images])

  // Cleanup staged images on unmount
  useEffect(() => {
    return () => {
      cleanupObjectUrls(stagedImages)
    }
  }, [stagedImages])

  const handleImageUpload = (files: FileList) => {
    if (files.length === 0) return

    setError(null)
    const remainingSlots = MAX_IMAGES_PER_PROJECT - stagedImages.length
    if (remainingSlots <= 0) {
      setError(`Maximum ${MAX_IMAGES_PER_PROJECT} images allowed per project`)
      return
    }

    const filesToProcess = Math.min(files.length, remainingSlots)
    const newStagedImages: StagedImage[] = []
    const validationErrors: string[] = []

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      const validation = validateImageFile(file)
      
      if (validation.valid) {
        const stagedImage = createStagedImageFromFile(file)
        newStagedImages.push(stagedImage)
      } else {
        validationErrors.push(`${file.name}: ${validation.error}`)
      }
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join('; '))
    }

    if (newStagedImages.length > 0) {
      setStagedImages(prev => [...prev, ...newStagedImages])
    }

    if (files.length > remainingSlots) {
      setError(prev => {
        const maxError = `Only ${remainingSlots} more image(s) can be added`
        return prev ? `${prev}; ${maxError}` : maxError
      })
    }
  }

  const removeImage = (index: number) => {
    setStagedImages(prev => {
      const imageToRemove = prev[index]
      const newImages = prev.filter((_, i) => i !== index)
      
      // Cleanup object URL if it's a staged file
      if (!imageToRemove.isExisting && imageToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      
      return newImages
    })
    
    setError(null) // Clear errors when removing images
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      setStagedImages(prev => reorderStagedImages(prev, draggedIndex, dropIndex))
    }
    
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const onSubmit = async (data: ProjectFormInput) => {
    setIsSubmitting(true)
    setError(null)
    setUploadProgress({})

    try {
      if (project) {
        // Update existing project
        await handleUpdateProject(data)
      } else {
        // Create new project
        await handleCreateProject(data)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateProject = async (data: ProjectFormInput) => {
    // Step 1: Create project without images
    const createResponse = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        images: [] // Empty initially
      })
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      throw new Error(errorData.error || 'Failed to create project')
    }

    const createdProject = await createResponse.json()
    
    // Step 2: Upload staged images if any
    if (stagedImages.length > 0) {
      const uploadResult = await uploadStagedImages(
        createdProject.id,
        stagedImages,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [progress.imageId]: progress }))
        }
      )

      if (!uploadResult.success) {
        throw new Error(uploadResult.errors?.join('; ') || 'Failed to upload images')
      }

      // Step 3: Update project with image URLs
      const updateResponse = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: createdProject.id,
          images: uploadResult.urls
        })
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.error || 'Failed to update project with images')
      }
    }

    onSuccess?.()
  }

  const handleUpdateProject = async (data: ProjectFormInput) => {
    if (!project) return

    // Determine which images are new vs existing
    const existingUrls = stagedImages.filter(img => img.isExisting).map(img => img.url)
    const imagesToDelete = getImagesToDelete(project.images || [], existingUrls)
    
    // Upload new images if any
    let finalImageUrls = existingUrls
    if (stagedImages.some(img => !img.isExisting)) {
      const uploadResult = await uploadStagedImages(
        project.id,
        stagedImages,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [progress.imageId]: progress }))
        }
      )

      if (!uploadResult.success) {
        throw new Error(uploadResult.errors?.join('; ') || 'Failed to upload images')
      }
      
      finalImageUrls = uploadResult.urls || []
    }

    // Update project
    const updateResponse = await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: project.id,
        ...data,
        images: finalImageUrls
      })
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(errorData.error || 'Failed to update project')
    }

    // Delete removed images from storage
    if (imagesToDelete.length > 0) {
      const deleteResult = await deleteImagesFromStorage(imagesToDelete)
      if (!deleteResult.success) {
        console.warn('Failed to delete some images:', deleteResult.errors)
      }
    }

    onSuccess?.()
  }

  const categories = [
    'Residential',
    'Commercial',
    'Interior Design',
    'Renovation',
    'Construction',
    'Architecture'
  ]

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          {...form.register('title')}
          placeholder="Enter project title"
          disabled={isSubmitting}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Describe the project..."
          rows={4}
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Category and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            {...form.register('category')}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Completion Date *</Label>
          <Input
            id="date"
            type="date"
            {...form.register('date')}
            disabled={isSubmitting}
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-600">{form.formState.errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...form.register('location')}
          placeholder="Project location"
          disabled={isSubmitting}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={form.watch('featured')}
          onCheckedChange={(checked) => form.setValue('featured', !!checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="featured">Feature this project on homepage</Label>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Project Images</Label>
            <p className="text-sm text-stone-600 mt-1">
              Maximum {MAX_IMAGES_PER_PROJECT} images ({stagedImages.length}/{MAX_IMAGES_PER_PROJECT})
              {stagedImages.length > 0 && ' • Drag to reorder'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || stagedImages.length >= MAX_IMAGES_PER_PROJECT}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>
              {stagedImages.length >= MAX_IMAGES_PER_PROJECT 
                ? 'Max Reached' 
                : 'Add Images'
              }
            </span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpg,image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          className="hidden"
        />

        {/* Upload Progress */}
        <AnimatePresence>
          {Object.keys(uploadProgress).length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-stone-50 rounded-md p-3 space-y-2"
            >
              <div className="text-sm font-medium text-stone-700">Uploading images...</div>
              {Object.values(uploadProgress).map((progress) => (
                <div key={progress.imageId} className="flex items-center space-x-2">
                  <div className="flex-1 bg-stone-200 rounded-full h-2">
                    <div
                      className="bg-stone-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-stone-600 min-w-[3rem]">
                    {progress.status === 'error' ? 'Error' : `${progress.progress}%`}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stagedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {stagedImages.map((stagedImage, index) => (
                <motion.div
                  key={stagedImage.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group cursor-move ${
                    draggedIndex === index ? 'opacity-50 scale-95' : ''
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Drag handle */}
                  <div className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <GripVertical className="w-3 h-3" />
                  </div>

                  {/* Image */}
                  <SupabaseImage
                    src={stagedImage.url}
                    alt={`Project image ${index + 1}`}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  
                  {/* Image status indicator */}
                  {!stagedImage.isExisting && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      New
                    </div>
                  )}

                  {/* Remove button */}
                  <motion.button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {stagedImages.length === 0 && (
          <div className="border-2 border-dashed border-stone-300 rounded-md p-8 text-center">
            <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600 mb-2">No images selected yet</p>
            <p className="text-sm text-stone-500 mb-4">
              Add up to {MAX_IMAGES_PER_PROJECT} images to showcase your project
              <br />
              Supported formats: JPG, PNG, WebP (max 50MB each)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              Select Images
            </Button>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {isSubmitting 
              ? (Object.keys(uploadProgress).length > 0 ? 'Uploading Images...' : 'Saving...')
              : project 
                ? 'Update Project' 
                : 'Create Project'
            }
          </span>
        </Button>
      </div>
    </form>
  )
}