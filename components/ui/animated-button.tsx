"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { buttonHoverVariants } from "@/lib/animations"

interface AnimatedButtonProps extends Omit<React.ComponentProps<typeof Button>, 'asChild'> {
  children: React.ReactNode
  className?: string
  animation?: "default" | "bounce" | "glow" | "slide"
  disabled?: boolean
}

const buttonAnimations = {
  default: buttonHoverVariants,
  bounce: {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  },
  glow: {
    rest: { 
      scale: 1,
      boxShadow: "0 0 0 rgba(201, 166, 107, 0)"
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 20px rgba(201, 166, 107, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  },
  slide: {
    rest: { 
      scale: 1,
      x: 0,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.02,
      x: 4,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98, x: 0 }
  }
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ className, animation = "default", children, disabled, ...props }, ref) => {
  const variants = buttonAnimations[animation]

  return (
    <motion.div
      variants={variants}
      initial="rest"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      className="inline-block"
    >
      <Button
        className={cn("relative overflow-hidden", className)}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
        {animation === "slide" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </Button>
    </motion.div>
  )
})

AnimatedButton.displayName = "AnimatedButton"