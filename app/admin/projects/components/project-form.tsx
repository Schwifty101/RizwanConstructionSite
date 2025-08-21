'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createProject, updateProject, uploadImage } from '@/lib/admin-actions'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/lib/supabase'

// Form-specific schema that matches the component's needs
const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  location: z.string().optional(),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([])
})

type ProjectFormInput = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>(project?.images || [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      category: project?.category ?? '',
      date: project?.date ?? new Date().toISOString().split('T')[0],
      location: project?.location ?? '',
      featured: project?.featured ?? false,
      images: project?.images ?? []
    }
  })

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return

    // Check if adding these images would exceed the limit
    const remainingSlots = 4 - images.length
    if (remainingSlots <= 0) {
      setError('Maximum 4 images allowed per project')
      return
    }

    // Limit the number of files to upload
    const filesToUpload = Math.min(files.length, remainingSlots)
    if (files.length > remainingSlots) {
      setError(`Only ${remainingSlots} more image(s) can be added. Maximum 4 images per project.`)
    }

    setUploadingImages(true)
    const newImages: string[] = []

    for (let i = 0; i < filesToUpload; i++) {
      const file = files[i]
      const result = await uploadImage(file)
      
      if (result.success && result.url) {
        newImages.push(result.url)
      } else {
        setError(`Failed to upload ${file.name}: ${result.error}`)
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      form.setValue('images', updatedImages)
    }

    setUploadingImages(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    form.setValue('images', updatedImages)
  }

  const onSubmit = async (data: ProjectFormInput) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = {
        ...data,
        images
      }

      const result = project 
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result.success) {
        onSuccess?.()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
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
            <p className="text-sm text-stone-600 mt-1">Maximum 4 images ({images.length}/4)</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || uploadingImages || images.length >= 4}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>
              {uploadingImages 
                ? 'Uploading...' 
                : images.length >= 4 
                  ? 'Max Reached' 
                  : 'Upload Images'
              }
            </span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          className="hidden"
        />

        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Image
                    src={image}
                    alt={`Project image ${index + 1}`}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <motion.button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

        {images.length === 0 && (
          <div className="border-2 border-dashed border-stone-300 rounded-md p-8 text-center">
            <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600 mb-2">No images uploaded yet</p>
            <p className="text-sm text-stone-500 mb-4">Add up to 4 images to showcase your project</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || uploadingImages}
            >
              Upload Your First Image
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
            disabled={isSubmitting || uploadingImages}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || uploadingImages}
        >
          {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}