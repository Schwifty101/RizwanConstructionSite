"use client"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { fadeInUp, containerVariants } from "@/lib/animations"
interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "stagger" | "hero"
  delay?: number
}
export function PageWrapper({ 
  children, 
  className = "", 
  variant = "default",
  delay = 0 
}: PageWrapperProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const getVariants = () => {
    switch (variant) {
      case "stagger":
        return containerVariants
      case "hero":
        return {
          initial: { opacity: 0, y: 40 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, delay }
          }
        }
      default:
        return {
          ...fadeInUp,
          animate: {
            ...fadeInUp.animate,
            transition: { duration: 0.5, delay }
          }
        }
    }
  }
  const paddingClass = isHomePage ? "" : "pt-20"
  return (
    <motion.div
      variants={getVariants()}
      initial="initial"
      animate="animate"
      className={`${paddingClass} ${className}`.trim()}
    >
      {children}
    </motion.div>
  )
}
