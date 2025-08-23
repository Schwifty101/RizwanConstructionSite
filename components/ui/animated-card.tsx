"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { cardHoverVariants } from "@/lib/animations"

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
  className?: string
  animation?: "default" | "lift" | "tilt" | "glow" | "float"
  disabled?: boolean
}

const cardAnimations = {
  default: cardHoverVariants,
  lift: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02, 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  },
  tilt: {
    rest: { 
      scale: 1, 
      rotateX: 0,
      rotateY: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05, 
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  },
  glow: {
    rest: { 
      scale: 1,
      boxShadow: "0 0 0 rgba(201, 166, 107, 0)",
      borderColor: "transparent",
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 0 30px rgba(201, 166, 107, 0.3)",
      borderColor: "rgba(201, 166, 107, 0.5)",
      transition: { duration: 0.3 }
    }
  },
  float: {
    rest: { 
      y: 0,
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    hover: { 
      y: -4,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  }
}

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(({ className, animation = "default", children, disabled, ...props }, ref) => {
  const variants = cardAnimations[animation]

  return (
    <motion.div
      variants={variants}
      initial="rest"
      whileHover={disabled ? undefined : "hover"}
      animate={animation === "float" ? "rest" : undefined}
      className="h-full"
      style={{ perspective: 1000 }}
    >
      <Card
        className={cn(
          "h-full transition-colors duration-300",
          animation === "glow" && "border border-transparent",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  )
})

AnimatedCard.displayName = "AnimatedCard"