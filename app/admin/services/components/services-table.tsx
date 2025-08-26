'use client'

import { useState } from 'react'
import Link from 'next/link'
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

      // Refresh the page to show updated data
      window.location.reload()
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

      // Refresh the page to show updated data
      window.location.reload()
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
      <motion.div
        className="overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-20 text-center">Order</TableHead>
              <TableHead className="w-20 text-center">Status</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
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
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {service.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(service.created_at).toLocaleDateString()}
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
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {service.order_index}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(service)}
                      disabled={isToggling === service.id}
                      className={`h-8 w-16 ${
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setServiceToDelete(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

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