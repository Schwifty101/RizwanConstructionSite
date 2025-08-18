"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Project } from "@/lib/supabase"

interface PortfolioClientProps {
  projects: Project[]
  categories: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
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
    <>
      {/* Filter Section */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="min-w-[100px]"
              >
                {category}
              </Button>
            ))}
          </div>
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
                  <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-muted-foreground">Project Image</span>
                      </div>
                      {project.featured && (
                        <div className="absolute top-4 left-4 bg-muted-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="font-serif group-hover:text-muted-gold transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {project.category} • {project.location} • {new Date(project.date).getFullYear()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <Button asChild variant="outline" className="w-full group-hover:bg-muted-gold group-hover:text-white group-hover:border-muted-gold transition-colors">
                        <Link href={`/portfolio/${project.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
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
    </>
  )
}