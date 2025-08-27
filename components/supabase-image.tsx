'use client'
import Image from 'next/image'
import { getSafeImageUrl } from '@/lib/image-utils'
import { ComponentProps } from 'react'
interface SupabaseImageProps extends Omit<ComponentProps<typeof Image>, 'src' | 'srcSet' | 'placeholder'> {
  src: string | null | undefined
  fallbackText?: string
  fallbackWidth?: number
  fallbackHeight?: number
  priority?: boolean
}
export function SupabaseImage({ 
  src, 
  alt, 
  fallbackText = 'Project Image',
  fallbackWidth = 400,
  fallbackHeight = 300,
  className,
  priority = false,
  ...props 
}: SupabaseImageProps) {
  const safeImageUrl = getSafeImageUrl(src, fallbackWidth, fallbackHeight, fallbackText)
  return (
    <Image
      src={safeImageUrl}
      alt={alt || fallbackText}
      className={className}
      priority={priority}
      unoptimized
      {...props}
    />
  )
}
