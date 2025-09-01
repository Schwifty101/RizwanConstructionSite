"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
    // On the home page, base navbar background on hero visibility using IntersectionObserver for reliability
    if (isHomePage) {
      let observer: IntersectionObserver | null = null
      let retryTimer: number | undefined

      const observeHero = () => {
        const heroEl = document.getElementById('hero')
        if (!heroEl) return false

        // Ensure transparent when hero is initially present
        setIsScrolled(false)

        observer = new IntersectionObserver(
          ([entry]) => {
            // When hero is in view => transparent, else => solid
            setIsScrolled(!entry.isIntersecting)
          },
          {
            root: null,
            // Consider hero "in view" when at least 20% is visible
            threshold: 0.2,
          }
        )
        observer.observe(heroEl)
        return true
      }

      // Try immediately, then retry briefly in case hero mounts after navbar
      if (!observeHero()) {
        retryTimer = window.setInterval(() => {
          if (observeHero()) {
            if (retryTimer) window.clearInterval(retryTimer)
          }
        }, 100)
        // Stop retrying after a short period
        window.setTimeout(() => {
          if (retryTimer) window.clearInterval(retryTimer)
        }, 2000)
      }

      return () => {
        if (observer) observer.disconnect()
        if (retryTimer) window.clearInterval(retryTimer)
      }
    } else {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isHomePage])

  const navbarClasses = isHomePage && !isScrolled
    ? "fixed top-0 z-50 w-full bg-transparent backdrop-blur-none border-transparent"
    : "fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

  const textClasses = isHomePage && !isScrolled
    ? "text-paper-white hover:text-dusty-gold bg-transparent"
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
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-6 md:px-8 lg:px-12">
        {/* Logo - Left side */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/logo-new.svg"
                alt="TheNewHome Logo"
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12"
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Navigation - Center */}
        <NavigationMenu className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList className="flex space-x-8">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${textClasses} ${isHomePage && !isScrolled
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

        {/* Mobile menu button - Right side */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden"
        >
          <Button
            variant="ghost"
            size="icon"
            className={`z-50 relative p-3 transition-all duration-300 ${textClasses} ${isHomePage && !isScrolled
              ? "hover:bg-dusty-gold/10 hover:text-dusty-gold"
              : "hover:bg-muted-gold/10 hover:text-muted-gold"
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex flex-col justify-center">
              <motion.span
                className={`absolute w-6 h-0.5 rounded-full transition-colors duration-300 ${isHomePage && !isScrolled ? "bg-paper-white" : "bg-foreground"
                  }`}
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 0 : -6
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className={`absolute w-6 h-0.5 rounded-full transition-colors duration-300 ${isHomePage && !isScrolled ? "bg-paper-white" : "bg-foreground"
                  }`}
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  x: isMobileMenuOpen ? 20 : 0
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className={`absolute w-6 h-0.5 rounded-full transition-colors duration-300 ${isHomePage && !isScrolled ? "bg-paper-white" : "bg-foreground"
                  }`}
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? 0 : 6
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className="lg:hidden relative z-50 border-t border-border/20 bg-background/98 backdrop-blur-xl shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="container mx-auto max-w-6xl px-6 py-8">
                <motion.nav
                  className="space-y-6"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1
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
                        hidden: { opacity: 0, x: -30, y: 10 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          transition: {
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        }
                      }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        className="group relative font-serif text-2xl font-medium transition-all duration-300 py-4 px-4 -mx-4 block rounded-lg hover:bg-muted/50 text-foreground hover:text-muted-gold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <motion.div
                          className="absolute bottom-2 left-4 h-0.5 bg-gradient-to-r from-muted-gold to-muted-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ width: 0 }}
                          whileHover={{ width: "2rem" }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    className="py-2"
                    variants={{
                      hidden: { opacity: 0, scaleX: 0 },
                      visible: {
                        opacity: 1,
                        scaleX: 1,
                        transition: { duration: 0.4 }
                      }
                    }}
                  >
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                    className="pt-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        asChild
                        className={`w-full font-medium text-lg py-4 shadow-lg transition-all duration-300 ${buttonClasses}`}
                      >
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                          <span>Get Free Quote</span>
                          <motion.div
                            className="ml-2 opacity-70"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.div>
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}