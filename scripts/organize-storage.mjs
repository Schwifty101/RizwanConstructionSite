#!/usr/bin/env node

/**
 * Storage Organization Script for Rizwan Construction Website
 * 
 * This script helps organize project images in Supabase storage:
 * 1. Creates dedicated folders for each project
 * 2. Moves existing loose images to their respective project folders
 * 3. Updates database records with new organized URLs
 * 4. Cleans up old loose files
 * 
 * Usage: node scripts/organize-storage.mjs [--dry-run] [--project-id=<id>]
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const projectIdArg = args.find(arg => arg.startsWith('--project-id='))
const specificProjectId = projectIdArg ? projectIdArg.split('=')[1] : null

console.log('🚀 Storage Organization Script')
console.log('===============================')
if (dryRun) console.log('🔍 DRY RUN MODE - No changes will be made')
if (specificProjectId) console.log(`🎯 Targeting specific project: ${specificProjectId}`)
console.log('')

async function main() {
  try {
    // Step 1: Get all projects
    console.log('📋 Fetching projects...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, slug, images')
      .order('created_at', { ascending: false })

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`)
    }

    if (!projects || projects.length === 0) {
      console.log('⚠️  No projects found in database')
      return
    }

    console.log(`✅ Found ${projects.length} projects`)
    console.log('')

    // Filter to specific project if requested
    const targetProjects = specificProjectId 
      ? projects.filter(p => p.id === specificProjectId)
      : projects

    if (specificProjectId && targetProjects.length === 0) {
      console.log(`❌ Project with ID ${specificProjectId} not found`)
      return
    }

    // Step 2: List all files in storage bucket
    console.log('📁 Listing storage bucket contents...')
    const { data: storageFiles, error: storageError } = await supabase
      .storage
      .from('project-images')
      .list('', { limit: 1000 })

    if (storageError) {
      throw new Error(`Failed to list storage files: ${storageError.message}`)
    }

    console.log(`✅ Found ${storageFiles?.length || 0} files in storage`)
    console.log('')

    // Step 3: Organize each project's images
    let totalOrganized = 0
    let totalErrors = 0

    for (const project of targetProjects) {
      console.log(`🔧 Processing project: "${project.title}" (${project.slug})`)
      
      if (!project.images || project.images.length === 0) {
        console.log('   ⚠️  No images found for this project')
        continue
      }

      const organizedUrls = []
      let projectErrors = 0

      for (let i = 0; i < project.images.length; i++) {
        const imageUrl = project.images[i]
        console.log(`   🖼️  Processing image ${i + 1}/${project.images.length}`)
        
        try {
          // Extract filename from URL
          const urlParts = imageUrl.split('/')
          const fileName = urlParts[urlParts.length - 1]
          
          // Skip if already organized (contains project ID folder)
          if (imageUrl.includes(`/${project.id}/`)) {
            console.log(`   ✅ Already organized: ${fileName}`)
            organizedUrls.push(imageUrl)
            continue
          }

          // Skip temporary files
          if (fileName.startsWith('temp-')) {
            console.log(`   🧹 Skipping temporary file: ${fileName}`)
            organizedUrls.push(imageUrl)
            continue
          }

          // Generate new organized path
          const fileExt = fileName.split('.').pop()
          const timestamp = Date.now()
          const randomId = Math.random().toString(36).substring(2)
          const newFileName = `${project.id}/${timestamp}-${randomId}.${fileExt}`

          if (!dryRun) {
            // Move file to organized location
            const { error: moveError } = await supabase
              .storage
              .from('project-images')
              .move(fileName, newFileName)

            if (moveError) {
              console.log(`   ❌ Failed to move ${fileName}: ${moveError.message}`)
              organizedUrls.push(imageUrl) // Keep original URL
              projectErrors++
              continue
            }

            // Get new public URL
            const { data: { publicUrl } } = supabase
              .storage
              .from('project-images')
              .getPublicUrl(newFileName)

            organizedUrls.push(publicUrl)
            console.log(`   ✅ Moved to: ${newFileName}`)
          } else {
            console.log(`   🔍 Would move ${fileName} to: ${newFileName}`)
            organizedUrls.push(imageUrl) // Keep original for dry run
          }

          totalOrganized++
        } catch (error) {
          console.log(`   ❌ Error processing image: ${error.message}`)
          organizedUrls.push(imageUrl) // Keep original URL on error
          projectErrors++
        }
      }

      // Update project in database if we have organized URLs
      if (!dryRun && organizedUrls.length > 0) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ images: organizedUrls })
          .eq('id', project.id)

        if (updateError) {
          console.log(`   ❌ Failed to update project in database: ${updateError.message}`)
          totalErrors++
        } else {
          console.log(`   ✅ Updated project database record`)
        }
      }

      totalErrors += projectErrors
      console.log('')
    }

    // Step 4: Summary
    console.log('📊 Summary')
    console.log('===========')
    console.log(`Projects processed: ${targetProjects.length}`)
    console.log(`Images organized: ${totalOrganized}`)
    console.log(`Errors encountered: ${totalErrors}`)

    if (dryRun) {
      console.log('')
      console.log('🔍 This was a dry run. To actually organize the files, run:')
      console.log('   node scripts/organize-storage.mjs')
    } else {
      console.log('')
      console.log('✅ Organization complete!')
    }

    // Step 5: Cleanup recommendations
    if (!dryRun && totalOrganized > 0) {
      console.log('')
      console.log('🧹 Cleanup Recommendations:')
      console.log('1. Verify all projects display correctly on the website')
      console.log('2. Remove any orphaned files manually if needed')
      console.log('3. Consider running this script periodically for maintenance')
    }

  } catch (error) {
    console.error('💥 Fatal error:', error.message)
    process.exit(1)
  }
}


// Run the script
main().catch(error => {
  console.error('💥 Unhandled error:', error)
  process.exit(1)
})