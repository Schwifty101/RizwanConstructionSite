import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Create a Supabase client configured to use cookies for server-side auth
function createSupabaseServerClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {
          // We can't set cookies in middleware, but we return the response later
        },
        remove() {
          // We can't remove cookies in middleware, but we return the response later
        }
      }
    }
  )
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = createSupabaseServerClient(request)
    
    // Get the current user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Authentication required. Please log in to access this resource.'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer'
          }
        }
      )
    }

    // Check if user has admin role (assuming admin role is stored in user metadata)
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.app_metadata?.role === 'admin' ||
                   user.email === process.env.ADMIN_EMAIL

    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden',
          message: 'Admin privileges required to access this resource.'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // User is authenticated and has admin privileges, proceed with the request
    return await handler(request)
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Authentication service temporarily unavailable.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

// Middleware for API routes that require authentication
export function requireAuth() {
  return async (request: NextRequest) => {
    return withAuth(request, async () => {
      // If we get here, user is authenticated and authorized
      // The actual API logic will be handled by the route handler
      return NextResponse.next()
    })
  }
}

// Helper function to extract user from request in API routes
export async function getCurrentUser(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to check if user is admin
export function isUserAdmin(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  
  const userObj = user as {
    user_metadata?: { role?: string }
    app_metadata?: { role?: string }
    email?: string
  }
  
  return userObj.user_metadata?.role === 'admin' || 
         userObj.app_metadata?.role === 'admin' ||
         userObj.email === process.env.ADMIN_EMAIL
}