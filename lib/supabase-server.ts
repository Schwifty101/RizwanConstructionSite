import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

// Create an authenticated Supabase client for server-side operations
export function createAuthenticatedSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {
          // No-op in API routes - cookies are already set by middleware
        },
        remove() {
          // No-op in API routes
        }
      }
    }
  )
}