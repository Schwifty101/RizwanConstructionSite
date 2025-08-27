const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}
const supabase = createClient(supabaseUrl, supabaseServiceKey)
async function testStorage() {
  try {
    console.log('🔧 Testing Supabase storage...')
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      console.log('💡 This usually means storage is not accessible or buckets don\'t exist')
      console.log('💡 Create buckets manually in Supabase Dashboard > Storage')
      return
    }
    console.log('📋 Existing buckets:', existingBuckets.map(b => b.name))
    const serviceImagesBucketExists = existingBuckets.some(bucket => bucket.name === 'service-images')
    const projectImagesBucketExists = existingBuckets.some(bucket => bucket.name === 'project-images')
    if (!serviceImagesBucketExists) {
      console.error('❌ service-images bucket is missing')
      console.log('💡 Create it manually in Supabase Dashboard > Storage')
    } else {
      console.log('✅ service-images bucket exists')
    }
    if (!projectImagesBucketExists) {
      console.error('❌ project-images bucket is missing')
      console.log('💡 Create it manually in Supabase Dashboard > Storage')
    } else {
      console.log('✅ project-images bucket exists')
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}
async function testDatabase() {
  try {
    console.log('🔍 Testing database connectivity...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .limit(1)
    if (servicesError) {
      console.error('❌ Error accessing services table:', servicesError)
      console.log('💡 Make sure you have run the database schema script in Supabase SQL Editor')
    } else {
      console.log(`✅ Services table accessible (${services?.length || 0} services found)`)
    }
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1)
    if (projectsError) {
      console.error('❌ Error accessing projects table:', projectsError)
    } else {
      console.log(`✅ Projects table accessible (${projects?.length || 0} projects found)`)
    }
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}
async function main() {
  console.log('🚀 Running Supabase setup and diagnostics...\n')
  await testDatabase()
  console.log('')
  await testStorage()
  console.log('\n📝 Next steps:')
  console.log('1. If you see database errors, run the schema.sql file in your Supabase SQL Editor')
  console.log('2. If storage buckets are missing, create them in Supabase Dashboard > Storage:')
  console.log('   - service-images (public, 10MB limit)')
  console.log('   - project-images (public, 50MB limit)')
  console.log('3. Make sure RLS policies are configured correctly')
  console.log('4. Test uploading an image through the admin interface')
}
main().catch(console.error)
