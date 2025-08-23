"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // On home page, show transparent navbar until scrolled past hero section (roughly 100vh)
      if (isHomePage) {
        setIsScrolled(scrollPosition > window.innerHeight * 0.8)
      } else {
        setIsScrolled(scrollPosition > 20)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once to set initial state
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  // Dynamic classes based on scroll state and page
  const navbarClasses = isHomePage && !isScrolled
    ? "fixed top-0 z-50 w-full bg-transparent backdrop-blur-none border-transparent"
    : "fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

  const textClasses = isHomePage && !isScrolled
    ? "text-paper-white hover:text-dusty-gold bg-transparent"
    : "text-foreground hover:text-muted-gold"

  const brandClasses = isHomePage && !isScrolled
    ? "text-paper-white hover:text-dusty-gold"
    : "text-foreground hover:text-muted-gold"

  const buttonClasses = isHomePage && !isScrolled
    ? "bg-dusty-gold/80 hover:bg-dusty-gold text-paper-white border-dusty-gold/50"
    : "bg-muted-gold hover:bg-muted-gold/90 text-white"

  return (
    <motion.header 
      className={navbarClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <motion.span 
              className={`font-serif text-2xl md:text-3xl font-bold transition-colors duration-300 ${brandClasses}`}
              whileHover={{ scale: 1.05 }}
            >
              The New Home
            </motion.span>
            <span className={`font-sans text-xs sm:text-sm sm:border-l sm:pl-3 leading-tight transition-colors duration-300 ${
              isHomePage && !isScrolled 
                ? "text-paper-white/80 sm:border-paper-white/30" 
                : "text-muted-foreground sm:border-border"
            }`}>
              Construction <br /> & Design
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-2">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${textClasses} ${
                    isHomePage && !isScrolled 
                      ? "hover:bg-dusty-gold/10" 
                      : "hover:bg-muted-gold/10"
                  }`} 
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      {item.name}
                    </Link>
                  </motion.div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Call to Action Button */}
        <motion.div 
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className={`font-medium transition-colors duration-300 ${buttonClasses}`}>
              <Link href="/contact">Get Quote</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden transition-colors duration-300 ${textClasses} ${
              isHomePage && !isScrolled 
                ? "hover:bg-dusty-gold/10 hover:text-dusty-gold" 
                : "hover:bg-muted-gold/10 hover:text-muted-gold"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-border bg-background/98 backdrop-blur"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto max-w-6xl px-4 py-6">
              <motion.nav 
                className="flex flex-col space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`font-serif text-xl font-medium transition-colors duration-300 py-2 block border-b last:border-b-0 ${textClasses} ${
                        isHomePage && !isScrolled 
                          ? "border-paper-white/20" 
                          : "border-border/30"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="pt-4"
                >
                  <Button asChild className={`w-full font-medium transition-colors duration-300 ${buttonClasses}`}>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Free Quote
                    </Link>
                  </Button>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}