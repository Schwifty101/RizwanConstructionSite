"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ImageSlideshow } from "@/components/ui/image-slideshow"
import { Project } from "@/lib/supabase"
import { containerVariants, itemVariants } from "@/lib/animations"

interface PortfolioClientProps {
  projects: Project[]
  categories: string[]
}


export function PortfolioClient({ projects, categories }: PortfolioClientProps) {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory))
    }
  }, [selectedCategory, projects])

  return (
    <div>
      {/* Filter Section */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="min-w-[100px]"
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredProjects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    <div className="group h-full hover:shadow-xl transition-all duration-500 overflow-hidden bg-card border rounded-lg">
                      <motion.div 
                        className="relative overflow-hidden rounded-t-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        {project.images && project.images.length > 0 ? (
                          <ImageSlideshow
                            images={project.images}
                            alt={project.title}
                            aspectRatio="portrait"
                            autoPlay={true}
                            autoPlayInterval={3000}
                            showDots={project.images.length > 1}
                            showArrows={project.images.length > 1}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">Project Image</span>
                          </div>
                        )}
                        
                        {project.featured && (
                          <motion.div 
                            className="absolute top-4 left-4 bg-muted-gold text-white px-3 py-1 rounded-full text-sm font-medium"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            Featured
                          </motion.div>
                        )}
                        
                        <motion.div
                          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                      </motion.div>
                      
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-muted-gold transition-colors duration-300 mb-2">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{project.category}</span>
                            <span>•</span>
                            <span>{project.location}</span>
                            <span>•</span>
                            <span>{new Date(project.date).getFullYear()}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {project.description}
                        </p>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button asChild variant="outline" className="w-full group-hover:bg-muted-gold group-hover:text-white group-hover:border-muted-gold transition-all duration-300">
                            <Link href={`/portfolio/${project.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-8">
                {selectedCategory === "All" 
                  ? "Projects will appear here once the database is configured with sample data."
                  : `No projects found in the "${selectedCategory}" category.`
                }
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("All")}
              >
                View All Projects
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}