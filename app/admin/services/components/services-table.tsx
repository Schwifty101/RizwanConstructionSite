'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { SupabaseImage } from '@/components/supabase-image'
import { Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { Service } from '@/lib/supabase'
import { containerVariants, itemVariants } from '@/lib/animations'
interface ServicesTableProps {
  services: Service[]
}
export function ServicesTable({ services }: ServicesTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const handleDelete = async () => {
    if (!serviceToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceToDelete.id })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete service')
      }
      router.refresh()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service. Please try again.')
    } finally {
      setIsDeleting(false)
      setServiceToDelete(null)
    }
  }
  const handleToggleStatus = async (service: Service) => {
    setIsToggling(service.id)
    try {
      const response = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          active: !service.active
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update service')
      }
      router.refresh()
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Failed to update service status. Please try again.')
    } finally {
      setIsToggling(null)
    }
  }
  if (services.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Plus className="h-12 w-12 text-stone-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-stone-800">No Services Yet</h3>
              <p className="text-stone-600 mt-1 max-w-md mx-auto">
                Get started by creating your first service to showcase your offerings.
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/admin/services/new" className="flex items-center justify-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create First Service</span>
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }
  return (
    <div>
      {}
      <div className="block md:hidden space-y-4 p-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 space-y-3 shadow-sm border border-stone-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  {service.image_url ? (
                    <SupabaseImage
                      src={service.image_url}
                      alt={service.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-stone-900">{service.name}</h3>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200 text-xs font-medium">
                    {service.order_index}
                  </span>
                </div>
                {service.description && (
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-stone-500">
                  <span className={`px-2 py-1 rounded-full ${service.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }`}>
                    {service.active ? 'Active' : 'Hidden'}
                  </span>
                  <span>{new Date(service.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(service)}
                disabled={isToggling === service.id}
                className={`${
                  service.active 
                    ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                {isToggling === service.id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : service.active ? (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hidden
                  </>
                )}
              </Button>
              <div className="flex items-center space-x-2 ml-auto">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="flex items-center space-x-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setServiceToDelete(service)}
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
        <motion.div
          className="overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.tr
                    key={service.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                            {service.image_url ? (
                              <SupabaseImage
                                src={service.image_url}
                                alt={service.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-stone-900">
                            {service.name}
                          </p>
                          <p className="text-sm text-stone-600">
                            Created {new Date(service.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-800 text-sm font-medium">
                        {service.order_index}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(service)}
                        disabled={isToggling === service.id}
                        className={`${
                          service.active 
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                      >
                        {isToggling === service.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : service.active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="flex items-center space-x-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setServiceToDelete(service)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      </div>
      <DeleteConfirmationDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete this service? This action cannot be undone.`}
        itemName={serviceToDelete?.name || 'service'}
        isDeleting={isDeleting}
      />
    </div>
  )
}
