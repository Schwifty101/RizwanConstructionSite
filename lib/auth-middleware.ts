import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
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
        },
        remove() {
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
export function requireAuth() {
  return async (request: NextRequest) => {
    return withAuth(request, async () => {
      return NextResponse.next()
    })
  }
}
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
export function isUserAuthenticated(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  const userObj = user as {
    id?: string
  }
  return Boolean(userObj.id)
}
