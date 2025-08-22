'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function BackButton({ 
  href, 
  label = 'Back', 
  className = 'cursor-pointer', 
  variant = 'outline' 
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant={variant}
        onClick={handleClick}
        className={`flex items-center space-x-2 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </motion.div>
  )
}