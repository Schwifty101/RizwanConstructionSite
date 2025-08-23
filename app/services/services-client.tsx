"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { containerVariants, itemVariants, presets, pageTransitionVariants } from "@/lib/animations"

interface Service {
  id: string
  name: string
  description: string
  details?: string[]
}

interface ServicesClientProps {
  services: Service[]
}

export function ServicesClient({ services }: ServicesClientProps) {
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
            Our Services
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
            Comprehensive construction and design solutions tailored to your needs. 
            From concept to completion, we deliver exceptional results.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((service, index) => (
              <motion.div key={service.id || index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <motion.div 
                        className="aspect-[4/3] bg-muted flex items-center justify-center rounded-t-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-muted-foreground">Service Image</span>
                      </motion.div>
                    </div>
                    <CardHeader>
                      <CardTitle className="font-serif text-xl">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      {'details' in service && service.details && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {service.details.slice(0, 3).map((detail: string, idx: number) => (
                            <li key={idx}>• {detail}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Detailed Services Accordion */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className="text-center mb-12" variants={presets.sectionTitle}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Service Details
              </h2>
              <p className="text-lg text-muted-foreground">
                Learn more about what each service includes and how we can help with your project.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {services.map((service, index) => (
                  <AccordionItem key={service.id || index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-serif text-lg">
                      {service.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <p className="text-muted-foreground mb-4">
                          {service.description}
                        </p>
                        {'details' in service && service.details && (
                          <div>
                            <h4 className="font-semibold mb-3">What&apos;s included:</h4>
                            <ul className="space-y-2 text-muted-foreground">
                              {service.details.map((detail: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-muted-gold mr-2">•</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We follow a proven process to ensure your project is completed successfully, 
              on time, and within budget.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                step: "1",
                title: "Consultation",
                description: "Initial meeting to discuss your vision, requirements, and budget"
              },
              {
                step: "2",
                title: "Planning",
                description: "Detailed project planning, design, and timeline development"
              },
              {
                step: "3",
                title: "Execution",
                description: "Professional construction with regular updates and quality control"
              },
              {
                step: "4",
                title: "Completion",
                description: "Final walkthrough, cleanup, and project handover"
              }
            ].map((phase, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Card className="text-center h-full">
                    <CardHeader>
                      <motion.div 
                        className="w-12 h-12 bg-muted-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {phase.step}
                      </motion.div>
                      <CardTitle className="font-serif">{phase.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {phase.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Contact us today to discuss your project and receive a personalized quote. 
              We&apos;re here to help bring your vision to life.
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
                    <Link href="/contact">Get Free Quote</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" size="lg">
                    <Link href="/portfolio">View Our Work</Link>
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