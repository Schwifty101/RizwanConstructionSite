'use client'

import Image from 'next/image'
import { getSafeImageUrl } from '@/lib/image-utils'
import { ComponentProps } from 'react'

interface SupabaseImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
  src: string | null | undefined
  fallbackText?: string
  fallbackWidth?: number
  fallbackHeight?: number
}

export function SupabaseImage({ 
  src, 
  alt, 
  fallbackText = 'Project Image',
  fallbackWidth = 400,
  fallbackHeight = 300,
  className,
  ...props 
}: SupabaseImageProps) {
  const safeImageUrl = getSafeImageUrl(src, fallbackWidth, fallbackHeight, fallbackText)
  
  // Check if this is a Supabase storage URL
  const isSupabaseUrl = safeImageUrl.includes('/storage/v1/object/public/')
  
  // For Supabase URLs, use unoptimized to bypass Next.js image optimization
  // This prevents timeout errors from Supabase's storage
  if (isSupabaseUrl) {
    return (
      <Image
        src={safeImageUrl}
        alt={alt}
        className={className}
        unoptimized
        {...props}
      />
    )
  }
  
  // For other URLs (including data URLs from getSafeImageUrl), use optimized
  return (
    <Image
      src={safeImageUrl}
      alt={alt}
      className={className}
      {...props}
    />
  )
}