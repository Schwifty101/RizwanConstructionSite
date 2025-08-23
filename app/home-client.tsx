"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageSlideshow } from "@/components/ui/image-slideshow"
import { containerVariants, itemVariants, presets, pageTransitionVariants } from "@/lib/animations"
import { getSafeImageUrl, validateImageArray } from "@/lib/image-utils"
import { Project } from "@/lib/supabase"

interface HomeClientProps {
  featuredProjects: Project[]
}

export function HomeClient({ featuredProjects }: HomeClientProps) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-orange-100/30 to-yellow-100/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,245,220,0.3)_0%,rgba(255,253,208,0.1)_100%)]"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6"
            variants={presets.heroSection}
          >
            Quality Construction<br />
            <span className="text-muted-gold">& Design</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.3 }
              }
            }}
          >
            Professional construction and interior design services. 
            Bringing your vision to life with quality craftsmanship and attention to detail.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.6 }
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">Get Quote</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
            <motion.div className="text-center mb-16" variants={presets.sectionTitle}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our latest construction and design work that showcases our commitment to excellence
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <motion.div
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                    >
                      <Card className="group h-full hover:shadow-lg transition-shadow duration-300">
                        <motion.div 
                          className="relative overflow-hidden rounded-t-lg"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ImageSlideshow
                            images={validateImageArray(project.images).map(img => 
                              getSafeImageUrl(img, 400, 300, project.title)
                            )}
                            alt={project.title}
                            aspectRatio="portrait"
                            autoPlay={true}
                            autoPlayInterval={4000}
                            showDots={validateImageArray(project.images).length > 1}
                            showArrows={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </motion.div>
                        <CardHeader>
                          <CardTitle className="font-serif group-hover:text-muted-gold transition-colors duration-300">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {project.category} • {project.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button asChild variant="outline" className="w-full group-hover:bg-muted-gold group-hover:text-white group-hover:border-muted-gold transition-colors duration-300">
                              <Link href={`/portfolio/${project.slug}`}>View Details</Link>
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <motion.div className="col-span-full text-center py-12" variants={itemVariants}>
                  <p className="text-muted-foreground text-lg">
                    Featured projects will appear here once the database is configured.
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg">
                  <Link href="/portfolio">View All Projects</Link>
                </Button>
              </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
            <motion.div className="text-center mb-16" variants={presets.sectionTitle}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From conception to completion, we provide comprehensive construction and design solutions
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  title: "Residential Construction",
                  description: "Complete home building services from foundation to finish"
                },
                {
                  title: "Interior Design",
                  description: "Professional interior design consulting and implementation"
                },
                {
                  title: "Renovation Services",
                  description: "Transform your existing space with expert renovation"
                }
              ].map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="font-serif">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">All Services</Link>
                </Button>
              </motion.div>
            </motion.div>
        </div>
      </section>
    </motion.div>
  )
}