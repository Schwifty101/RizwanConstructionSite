import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { createAuthenticatedSupabaseClient } from '@/lib/supabase-server'
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimiters } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  // Apply rate limiting for uploads
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, rateLimiters.projects)
  
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetTime)
  }

  return withAuth(request, async () => {
    let bucket = ''
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File
      const filename = formData.get('filename') as string
      bucket = formData.get('bucket') as string

      if (!file || !filename || !bucket) {
        return NextResponse.json(
          { error: 'File, filename, and bucket are required' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create authenticated supabase client for this request
      const supabaseAuth = createAuthenticatedSupabaseClient(request)

      // Upload to Supabase storage
      const { data, error } = await supabaseAuth.storage
        .from(bucket)
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true // Replace existing file with same name
        })

      if (error) {
        console.error('Supabase storage error:', error)
        
        // Provide specific error message for missing bucket
        if (error.message?.includes('Bucket not found') || error.message?.includes('bucket')) {
          return NextResponse.json(
            { error: `Storage bucket '${bucket}' not found. Please create it in Supabase Dashboard > Storage.` },
            { status: 404 }
          )
        }
        
        return NextResponse.json(
          { error: `Failed to upload file: ${error.message}` },
          { status: 500 }
        )
      }

      // Get the public URL
      const { data: urlData } = supabaseAuth.storage
        .from(bucket)
        .getPublicUrl(filename)

      return NextResponse.json({
        url: urlData.publicUrl,
        path: data.path
      })

    } catch (error: unknown) {
      console.error('Upload error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Provide specific error message for missing bucket
      if (errorMessage.includes('Bucket not found') || errorMessage.includes('bucket')) {
        return NextResponse.json(
          { error: `Storage bucket '${bucket}' not found. Please create it in Supabase Dashboard > Storage.` },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to upload file: ${errorMessage}` },
        { status: 500 }
      )
    }
  })
}