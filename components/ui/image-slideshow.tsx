'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupabaseImage } from '@/components/supabase-image'

interface ImageSlideshowProps {
  images: string[]
  alt: string
  className?: string
  aspectRatio?: 'square' | 'video' | 'portrait'
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  sizes?: string
}

export function ImageSlideshow({
  images,
  alt,
  className = '',
  aspectRatio = 'video',
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // If only one image, don't show controls
  const hasMultipleImages = images.length > 1
  
  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, images.length, isHovered, hasMultipleImages])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className={`bg-stone-100 flex items-center justify-center ${getAspectRatioClass(aspectRatio)} ${className}`}>
        <p className="text-stone-500">No images available</p>
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg bg-stone-100 ${getAspectRatioClass(aspectRatio)} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          <SupabaseImage
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1} of ${images.length}`}
            fill
            className="object-cover"
            sizes={sizes}
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {hasMultipleImages && showArrows && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </>
      )}

      {/* Dot Indicators */}
      {hasMultipleImages && showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-md' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-10"
        >
          {currentIndex + 1} / {images.length}
        </motion.div>
      )}
    </div>
  )
}

function getAspectRatioClass(aspectRatio: string): string {
  switch (aspectRatio) {
    case 'square':
      return 'aspect-square'
    case 'portrait':
      return 'aspect-[4/5]'
    case 'video':
    default:
      return 'aspect-video'
  }
}