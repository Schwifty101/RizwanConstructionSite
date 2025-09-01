"use client"

import Link from "next/link"
import { motion } from "framer-motion"
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
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-60"
            style={{
              backgroundImage: 'url(/images/hero/hero-bgl1.jpg)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-4 text-center py-20 sm:py-24">
          <motion.div
            className="max-w-5xl mx-auto"
            variants={presets.heroSection}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-retro-display text-paper-white mb-6 sm:mb-8 drop-shadow-2xl leading-tight"
              variants={{
                initial: { opacity: 0, y: 50 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
                }
              }}
            >
              TheNewHome <br />
              <span className="text-dusty-gold drop-shadow-lg text-5xl">Where Dreams take Shape</span>
            </motion.h1>

            <motion.div
              className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-dusty-gold to-transparent mx-auto mb-6 sm:mb-8 rounded-full"
              variants={{
                initial: { opacity: 0, scaleX: 0 },
                animate: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.5 }
                }
              }}
            />

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-paper-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 font-large leading-relaxed drop-shadow-lg px-4 sm:px-0"
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.6 }
                }
              }}
            >
              We believe every space has a story, and we&apos;re here to help you tell yours.
              Combining elegance, comfort, and modern design to create spaces that inspire.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0"
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.9 }
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="btn-retro text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-2xl w-full sm:w-auto">
                  <Link href="/portfolio">Explore Portfolio</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      <section className="py-24 bg-paper-white relative">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-20" variants={presets.sectionTitle}>
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-retro-display text-charcoal mb-6 leading-tight">
              Featured<br />
              <span className="text-warm-brown">Craftwork</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-warm-brown to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-warm-brown/80 max-w-3xl mx-auto leading-relaxed font-medium">
              From custom texture coatings to elegant false ceilings, every detail is designed
              to transform your home, office, restaurant, or hotel into an inspiring space.
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
                    whileHover={{ y: -8, rotateX: 2 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="perspective-1000"
                  >
                    <div className="bg-card border border-border/10 group h-full rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-border/20">
                      <motion.div
                        className="relative overflow-hidden"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div className="relative">
                          <ImageSlideshow
                            images={validateImageArray(project.images).map(img =>
                              getSafeImageUrl(img, 400, 300, project.title)
                            )}
                            alt={project.title}
                            aspectRatio="portrait"
                            autoPlay={true}
                            autoPlayInterval={3500}
                            showDots={validateImageArray(project.images).length > 1}
                            showArrows={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-warm-brown/5"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-dusty-gold/20 to-transparent"></div>
                        </div>
                      </motion.div>

                      <div className="p-6 relative z-10">
                        <div className="mb-3">
                          <h3 className="text-xl font-serif font-bold text-charcoal group-hover:text-dusty-gold transition-colors duration-300 mb-2">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-warm-brown/70">
                            <span className="text-retro-caps tracking-wide">{project.category}</span>
                            <span className="w-1 h-1 bg-dusty-gold rounded-full"></span>
                            <span className="font-medium">{project.location}</span>
                          </div>
                        </div>

                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-dusty-gold to-transparent mb-4 rounded-full"></div>

                        <p className="text-warm-brown/80 mb-6 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button asChild variant="outline" className="w-full btn-retro-outline group-hover:bg-dusty-gold/10 group-hover:border-dusty-gold transition-all duration-300">
                            <Link href={`/portfolio/${project.slug}`} className="font-medium tracking-wide">
                              View Project
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
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
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dusty-gold to-transparent mx-auto mb-8 rounded-full opacity-60"></div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="btn-retro px-12 py-4 text-lg font-medium tracking-wide shadow-xl">
                <Link href="/portfolio">Explore Complete Portfolio</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-warm-brown/5 to-charcoal/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.03)_0%,transparent_50%)] opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-20" variants={presets.sectionTitle}>
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-retro-display text-charcoal mb-6 leading-tight">
              Mastery in<br />
              <span className="text-dusty-gold">Every Detail</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rust-orange to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-warm-brown/80 max-w-3xl mx-auto leading-relaxed font-medium">
              From texture coating and vinyl flooring to custom blinds and aluminium work,
              we bring expertise and creativity to every interior design challenge.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Home Interiors",
                description: "Complete solutions including doors, windows, ceilings, flooring, and furniture to transform your sanctuary with warmth and elegance.",
                icon: "🏠"
              },
              {
                title: "Hotel & Restaurant Interiors",
                description: "International hospitality standards with comfort, functionality, and striking aesthetics for unforgettable experiences.",
                icon: "🏨"
              },
              {
                title: "Office Interiors",
                description: "Enhance productivity with tailored plans featuring custom furniture, ceilings, and elements that reflect your brand identity.",
                icon: "🏢"
              }
            ].map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -12, rotateY: 5 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="perspective-1000"
                >
                  <div className="bg-card border border-border/10 text-center h-full p-8 rounded-xl group hover:shadow-2xl hover:border-border/20 transition-all duration-500">
                    <motion.div
                      className="text-5xl mb-6 inline-block filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {service.icon}
                    </motion.div>

                    <h3 className="text-2xl font-serif font-bold text-charcoal group-hover:text-dusty-gold transition-colors duration-300 mb-4">
                      {service.title}
                    </h3>

                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-dusty-gold to-transparent mx-auto mb-6 opacity-60 group-hover:opacity-100 transition-all duration-300 rounded-full"></div>

                    <p className="text-warm-brown/80 leading-relaxed text-lg">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-dusty-gold to-transparent mx-auto mb-8 rounded-full opacity-60"></div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" variant="outline" className="btn-retro-outline px-12 py-4 text-lg font-medium tracking-wide shadow-xl border-2">
                <Link href="/services">Discover All Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}