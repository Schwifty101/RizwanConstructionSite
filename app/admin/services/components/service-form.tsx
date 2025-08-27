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
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { SupabaseImage } from '@/components/supabase-image'
import { Service } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
const serviceFormSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(255),
  description: z.string().optional(),
  order_index: z.number().min(0, 'Order must be 0 or greater'),
  active: z.boolean().default(true)
})
type ServiceFormInput = z.infer<typeof serviceFormSchema>
interface ServiceFormProps {
  service?: Service
  onSuccess?: () => void
  onCancel?: () => void
}
export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(service?.image_url || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      order_index: service?.order_index ?? 0,
      active: service?.active ?? true
    }
  })
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }
    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const uploadImage = async (file: File, serviceName: string): Promise<string> => {
    const formData = new FormData()
    const fileExtension = file.name.split('.').pop()
    const filename = `${serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${fileExtension}`
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('bucket', 'service-images')
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload image')
    }
    const { url } = await response.json()
    return url
  }
  const onSubmit = async (data: ServiceFormInput) => {
    setIsSubmitting(true)
    setError(null)
    setUploadProgress(0)
    try {
      let imageUrl = service?.image_url
      if (selectedImage) {
        setUploadProgress(50)
        imageUrl = await uploadImage(selectedImage, data.name)
        setUploadProgress(100)
      }
      const serviceData = {
        ...data,
        image_url: imageUrl,
        ...(service && { id: service.id })
      }
      const url = '/api/services'
      const method = service ? 'PATCH' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${service ? 'update' : 'create'} service`)
      }
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/services')
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }
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
      {}
      <div className="space-y-2">
        <Label htmlFor="name">Service Name *</Label>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="Enter service name"
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>
      {}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Describe the service..."
          rows={4}
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>
      {}
      <div className="space-y-2">
        <Label htmlFor="order_index">Display Order</Label>
        <Input
          id="order_index"
          type="number"
          min="0"
          {...form.register('order_index', { valueAsNumber: true })}
          placeholder="0"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          Lower numbers appear first in the services list
        </p>
        {form.formState.errors.order_index && (
          <p className="text-sm text-red-600">{form.formState.errors.order_index.message}</p>
        )}
      </div>
      {}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={form.watch('active')}
          onCheckedChange={(checked) => form.setValue('active', !!checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="active">Service is active and visible to users</Label>
      </div>
      {}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Service Image</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Choose Image</span>
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <AnimatePresence>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted rounded-md p-3"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">Uploading image...</div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border bg-muted">
                <SupabaseImage
                  src={imagePreview}
                  alt="Service preview"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Image will be saved as: {form.watch('name').toLowerCase().replace(/[^a-z0-9]+/g, '-')} 
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {!imagePreview && (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No image selected</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image to represent this service
              <br />
              Supported formats: JPG, PNG, WebP (max 10MB)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              Select Image
            </Button>
          </div>
        )}
      </div>
      {}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onCancel ? onCancel() : router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {isSubmitting 
              ? (uploadProgress > 0 ? 'Uploading...' : 'Saving...')
              : service 
                ? 'Update Service' 
                : 'Create Service'
            }
          </span>
        </Button>
      </div>
    </form>
  )
}
