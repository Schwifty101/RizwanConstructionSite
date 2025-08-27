export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3 } }
}
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}
export const slideInFromLeft = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 12, transition: { duration: 0.3 } }
}
export const slideInFromRight = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.3 } }
}
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
}
export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.25
    }
  }
}
export const cardHoverVariants = {
  rest: { 
    scale: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2 }
  }
}
export const buttonHoverVariants = {
  rest: { 
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}
export const imageHoverVariants = {
  rest: { 
    scale: 1,
    transition: { duration: 0.4 }
  },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.4 }
  }
}
export const pageTransitionVariants = {
  initial: { 
    opacity: 0, 
    y: 8,
    transition: { duration: 0.3 }
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.3 }
  }
}
export const easing = {
  easeOut: [0.4, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
} as const
export const duration = {
  fast: 0.2,
  medium: 0.4,
  slow: 0.6,
  slower: 0.8
} as const
export const getStaggerDelay = (isMobile: boolean) => ({
  staggerChildren: isMobile ? 0.15 : 0.1,
  delayChildren: isMobile ? 0.2 : 0.1
})
export const presets = {
  heroSection: {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  },
  sectionTitle: {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  },
  card: {
    initial: { opacity: 0, y: 8, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -4,
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  },
  button: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.25 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.15 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }
}
