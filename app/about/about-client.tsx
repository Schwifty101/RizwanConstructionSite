"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { containerVariants, itemVariants, presets, pageTransitionVariants } from "@/lib/animations"

export function AboutClient() {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6"
              variants={presets.heroSection}
            >
              About The New Home
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.3 }
                }
              }}
            >
              We believe every space has a story, and we&apos;re here to help you tell yours. 
              Creating elegant, comfortable, and modern interior designs for homes, offices, restaurants, and hotels.
            </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Experience & Expertise
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At The New Home, we specialize in interior designs that combine elegance, comfort, 
                and modern innovation. Our expertise spans texture coating, window blinds, vinyl and wooden flooring, 
                false ceilings, and aluminium & glass work to create truly inspiring spaces.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Whether it&apos;s your home sanctuary, a professional office environment, or a hospitality space 
                meeting international standards, we work closely with you to turn your ideas into reality.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg">
                  <Link href="/portfolio">View My Work</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-muted-foreground text-lg">Professional Photo</span>
            </motion.div>
          </motion.div>

          {/* Philosophy & Values */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <AnimatedCard animation="lift">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Elegant Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every project reflects our commitment to elegance and modern design, 
                    using premium materials and innovative techniques for lasting beauty.
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="lift">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Your Story, Our Craft</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe every space has a story. We work closely with you to 
                    understand your vision and transform it into inspiring, personalized spaces.
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="lift">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Professional Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From texture coatings to custom blinds, we deliver professional results 
                    that reflect our promise to turn your ideas into inspiring spaces.
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          </motion.div>

          {/* Services Overview */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Areas of Expertise
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <AnimatedCard animation="glow">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Interior Design Services</CardTitle>
                  <CardDescription>Complete interior solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Texture Coating & Zola Paint</li>
                    <li>• Window Blinds & Curtains</li>
                    <li>• Vinyl & Wooden Flooring</li>
                    <li>• False Ceilings</li>
                    <li>• Aluminium & Glass Work</li>
                  </ul>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="glow">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Specialized Services</CardTitle>
                  <CardDescription>Tailored for every space</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Home Interiors (complete solutions)</li>
                    <li>• Hotel & Restaurant Interiors</li>
                    <li>• Office Interiors (productivity-focused)</li>
                    <li>• Custom Windows (Wood & Aluminium)</li>
                    <li>• Paints & Finishes selection</li>
                  </ul>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center bg-muted/30 rounded-lg p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your vision and how I can help bring it to life. 
              Get in touch for a consultation and project estimate.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg">
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" size="lg">
                    <Link href="/services">View Services</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}