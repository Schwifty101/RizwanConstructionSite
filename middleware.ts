import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only apply middleware to admin routes, but exclude login and unauthorized pages
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to login and unauthorized pages without authentication
  if (request.nextUrl.pathname === '/admin/login' || 
      request.nextUrl.pathname === '/admin/unauthorized') {
    return NextResponse.next()
  }

  try {
    // Create a response object
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            request.cookies.delete(name)
            response.cookies.delete(name)
          },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's no user or there's an error, redirect to login
    if (error || !user) {
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // User is authenticated - allow access to admin routes
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login
    const redirectUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/admin/:path*']
}