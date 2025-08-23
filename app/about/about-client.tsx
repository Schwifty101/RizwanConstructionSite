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
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6"
              variants={presets.heroSection}
            >
              About Rizwan
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
              Dedicated to delivering exceptional construction and interior design services 
              with a passion for quality craftsmanship and innovative solutions.
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
                With over a decade of experience in construction and interior design, 
                I have developed a reputation for delivering projects that exceed expectations. 
                My approach combines traditional craftsmanship with modern techniques to create 
                spaces that are both functional and beautiful.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                From residential homes to commercial spaces, I work closely with clients 
                to understand their vision and bring it to life within budget and on schedule.
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
                  <CardTitle className="font-serif text-xl">Quality First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every project is executed with meticulous attention to detail, 
                    using only the finest materials and proven construction methods.
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="lift">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Client Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your vision is at the heart of every project. I work closely with 
                    clients throughout the process to ensure their goals are achieved.
                  </p>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="lift">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Timely Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Reliable project management and clear communication ensure 
                    projects are completed on time and within budget.
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
                  <CardTitle className="font-serif text-2xl">Construction Services</CardTitle>
                  <CardDescription>Complete building solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Residential construction</li>
                    <li>• Commercial building</li>
                    <li>• Renovations and additions</li>
                    <li>• Structural modifications</li>
                    <li>• Foundation and framing</li>
                  </ul>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard animation="glow">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Interior Design</CardTitle>
                  <CardDescription>Transforming spaces with style</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Space planning and design</li>
                    <li>• Kitchen and bathroom design</li>
                    <li>• Custom furniture and fixtures</li>
                    <li>• Color and material selection</li>
                    <li>• Lighting design</li>
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