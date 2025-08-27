'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, Home } from 'lucide-react'

export function AdminHeader() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/admin" 
              className="text-xl font-semibold text-stone-800 hover:text-stone-600"
            >
              Admin Dashboard
            </Link>
            
            {/* <nav className="hidden md:flex space-x-6">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                href="/admin/projects" 
                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md transition-colors"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Link>
              
              <Link 
                href="/admin/services" 
                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 px-3 py-2 rounded-md transition-colors"
              >
                <Wrench className="h-4 w-4" />
                <span>Services</span>
              </Link>
            </nav> */}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}