"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
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
      {}
      <section className="py-20 bg-gradient-to-br from-cream to-beige">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6"
            variants={presets.heroSection}
          >
            Muhammad Rizwan
          </motion.h1>
          <motion.p
            className="text-2xl text-muted-foreground max-w-3xl mx-auto"
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.3 }
              }
            }}
          >
            {}
            Designing Homes, Building Dreams Since 1984
          </motion.p>
        </div>
      </section>
      {}
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
                My Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At TheNewHome, we specialize in interior designs that combine elegance, comfort,
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
          {}
          {}
          {}
          {}
          {}
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
